import Seller from "../../models/seller.js";
import Branch from "../../models/branch.js";

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
        console.error("Seller List API Error:", error.message);
        return res.status(500).json({
            message: error.message
        });
    }
};

/**
 * @desc    Get seller with branches
 * @route   GET /api/sellers/:id
 * @access  Public / Admin
 */
export const getSellerBranches = async (req, res) => {
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
        console.error("Get Seller Branches Error:", error.message);
        return res.status(500).json({
            message: error.message
        });
    }
};


/**
 * @desc    Get products by seller & branch
 * @route   GET /api/products/seller
 * @access  Public / Seller
 */
export const getSellerProducts = async (req, res) => {
    try {
        const { sellerId, branchId } = req.query;

        if (!sellerId) {
            return res.status(400).json({ message: "sellerId is required" });
        }

        const filter = { sellerId };
        if (branchId) {
            filter.branch = branchId;
        }

        const products = await Product.find(filter);

        if (!products || products.length === 0) {
            return res.status(200).json({
                message: "This Seller and Branch Product Not Found !",
                products: []
            });
        }

        return res.status(200).json({ products });

    } catch (error) {
        console.error("Product getting error of the seller:", error.message);
        return res.status(500).json({ message: error.message });
    }
};
