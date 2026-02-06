import Product from "../../models/product.js";
import Seller from "../../models/seller.js"
import Branch from "../../models/branch.js"
/**
 * GET /api/products
 * Search + Filter products
 */
export const getProducts = async (req, res) => {
    try {
        const {
            search = null,
            category = null,
            brand = null,
            minprice = null,
            maxprice = null,
        } = req.query;

        /* ---------- BUILD FILTER ---------- */
        const filter = {};

        let categories = category ? category.split(",") : [];
        let brands = brand ? brand.split(",") : [];

        if (categories.length) {
            filter.category = { $in: categories };
        }

        if (brands.length) {
            filter.brand = { $in: brands };
        }

        if (search) {
            filter.name = { $regex: search, $options: "i" };
        }

        if (minprice || maxprice) {
            filter.discountPrice = {};
            if (minprice) filter.discountPrice.$gte = Number(minprice);
            if (maxprice) filter.discountPrice.$lte = Number(maxprice);
        }

        /* ---------- STEP 1: FIND PRODUCT IDS ---------- */
        const baseProducts = await Product.find(filter)
            .select("_id")
            .lean();

        const productIds = baseProducts.map(p => p._id);

        if (!productIds.length) {
            return res.status(200).json({ products: [] });
        }

        /* ---------- STEP 2: AGGREGATE REVIEWS ---------- */
        const products = await Product.aggregate([
            {
                $match: { _id: { $in: productIds } }
            },
            {
                $lookup: {
                    from: "reviews",
                    localField: "_id",
                    foreignField: "productId",
                    as: "reviews"
                }
            },
            {
                $addFields: {
                    avgRating: {
                        $cond: [
                            { $gt: [{ $size: "$reviews" }, 0] },
                            { $round: [{ $avg: "$reviews.rating" }, 1] },
                            0
                        ]
                    },
                    reviewCount: { $size: "$reviews" }
                }
            },
            {
                $project: { reviews: 0 }
            },
            { $sort: { createdAt: -1 } }
        ]);

        /* ---------- STEP 3: POPULATE ---------- */
        const populatedProducts = await Product.populate(products, [
            { path: "category", select: "name" },
            { path: "brand", select: "name" },
        ]);

        return res.status(200).json({ products: populatedProducts });

    } catch (error) {
        console.error("Product fetch error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

/**
 * GET /api/products/:id
 * Single product
 */
export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id)
            .populate({ path: "category", select: "name" });

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ product });

    } catch (error) {
        console.error("Single product error:", error);
        res.status(500).json({ message: "Server error" });
    }
};


/**
 * @desc    Get seller with branches
 * @route   GET /api/sellers/:id
 * @access  Public / Admin
 */
export const getSellerWithBranches = async (req, res) => {
    try {
        const { id } = req.params;

        const seller = await Seller.findById(id);
        if (!seller) {
            return res.status(404).json({
                message: "Seller Not Found!"
            });
        }

        const branches = await Branch.find({ sellerId: id });

        if (!branches || branches.length === 0) {
            return res.status(200).json({
                seller,
                branches: [],
                message: "No branches found for this seller"
            });
        }

        return res.status(200).json({
            seller,
            branches
        });

    } catch (error) {
        console.error("Get seller branches error:", error.message);
        return res.status(500).json({
            message: error.message
        });
    }
};

/**
 * @desc    Get all sellers
 * @route   GET /api/sellers
 * @access  Public / Admin
 */
export const getAllSellers = async (req, res) => {
    try {
        const sellers = await Seller.find()
            .populate("user", "name email");

        if (!sellers || sellers.length === 0) {
            return res.status(404).json({
                message: "Sellers Not Found!"
            });
        }

        return res.status(200).json({
            sellers
        });

    } catch (error) {
        console.error("Seller list error:", error.message);
        return res.status(500).json({
            message: error.message
        });
    }
};
