import Review from "../../models/review.js";
import Product from "../../models/product.js";
import User from "../../models/user.js";

/**
 * @desc    Get all reviews
 * @route   GET /api/reviews
 * @access  Public
 */
export const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find()
            .populate("userId", "name email")
            .populate("productId", "name");
        return res.status(200).json({ reviews });
    } catch (error) {
        console.error("Error getting reviews:", error.message);
        return res.status(500).json({ error: error.message });
    }
};

/**
 * @desc    Get reviews for a specific product
 * @route   GET /api/reviews/product/:id
 * @access  Public
 */
export const getReviewsByProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const reviews = await Review.find({ productId: id })
            .populate("userId", "name")
            .populate("productId", "name");

        return res.status(200).json({ reviews });
    } catch (error) {
        console.error("Error getting product reviews:", error.message);
        return res.status(500).json({ error: error.message });
    }
};

/**
 * @desc    Add a review for a product
 * @route   POST /api/reviews
 * @access  Private
 */
export const addReview = async (req, res) => {
    try {
        const { rating, comment, productId } = req.body;
        const userId = req.userid;

        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const existingReview = await Review.findOne({ userId, productId });
        if (existingReview) {
            return res.status(400).json({ message: "You already added a review for this product" });
        }

        const review = await Review.create({ userId, productId, rating, comment });
        return res.status(201).json({ review });
    } catch (error) {
        console.error("Error adding review:", error.message);
        return res.status(500).json({ error: error.message });
    }
};
