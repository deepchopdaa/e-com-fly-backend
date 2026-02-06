import Product from "../../models/product.js";
import Review from "../../models/review.js";

export const ProductDetail = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "Product ID not found!" });
        }

        const product = await Product.findById(id)
            .populate("category", "name")
            .populate("brand", "name");

        if (!product) {
            return res.status(404).json({ message: "Product not found!" });
        }

        const similarProducts = await Product.find({
            _id: { $ne: id },
            category: product.category._id,
        }).limit(4);

        const reviews = await Review.find({ productId: id })
            .populate("userId", "name")
            .lean();

        const reviewCount = reviews.length;

        const avgRating =
            reviewCount > 0
                ? Number(
                    (
                        reviews.reduce(
                            (sum, r) => sum + (r.rating || 0),
                            0
                        ) / reviewCount
                    ).toFixed(1)
                )
                : 0;

        return res.status(200).json({
            product,
            similarProducts,
            reviews,
            reviewCount,
            avgRating,
        });
    } catch (error) {
        return res
            .status(500)
            .json({ message: error.message || "Something went wrong" });
    }
};


export const productIds = async (req, res) => {
    try {
        const products = await Product.find().select("_id").lean();
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};