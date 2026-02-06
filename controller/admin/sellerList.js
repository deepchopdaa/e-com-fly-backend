import Seller from "../../models/seller.js";

/**
 * @desc    Get all sellers
 * @route   GET /api/sellers
 * @access  Public / Admin
 */
export const getAllSellers = async (req, res) => {
    try {
        const sellers = await Seller.find()
            .populate("user", "name email") // select required fields only
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: sellers.length,
            data: sellers,
        });

    } catch (error) {
        console.error("Get Sellers Error:", error.message);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
