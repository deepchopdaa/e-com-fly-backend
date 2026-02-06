import mongoose from "mongoose";
import Order from "../../models/order.js";
import Seller from "../../models/seller.js";

/**
 * @desc    Get orders for logged-in seller
 * @route   GET /api/orders/seller
 * @access  Seller
 */
export const getSellerOrders = async (req, res) => {
    try {
        // 🔹 Get userId from headers
        const userId = req.userId;

        if (!userId) {
            return res.status(400).json({ message: "UserId missing" });
        }

        // 🔹 Find seller using userId
        const seller = await Seller.findOne({ user: userId });

        if (!seller) {
            return res.status(404).json({ message: "Seller not found" });
        }

        const sellerId = new mongoose.Types.ObjectId(seller._id);

        // 🔹 Aggregate orders for this seller only
        const orders = await Order.aggregate([
            {
                $match: {
                    "orderItems.sellerId": sellerId,
                },
            },
            {
                $addFields: {
                    orderItems: {
                        $filter: {
                            input: "$orderItems",
                            as: "item",
                            cond: { $eq: ["$$item.sellerId", sellerId] },
                        },
                    },
                },
            },
            {
                $sort: { createdAt: -1 },
            },
        ]);

        return res.status(200).json({ orders });

    } catch (error) {
        console.error("Get seller orders error:", error);
        return res.status(500).json({ message: error.message });
    }
};


const ORDER_STATUSES = [
    "Pending",
    "Confirmed",
    "Packed",
    "Shipped",
    "Out for Delivery",
    "Delivered",
    "Cancelled",
    "Returned",
];

/**
 * @desc    Update order status
 * @route   PATCH /api/orders/:id/status
 * @access  Admin / Seller
 */
export const updateOrderStatus = async (req, res) => {
    try {
        console.log('update status api called !')
        const { id } = req.params;
        const { orderStatus } = req.body;

        // 🔹 Validate status
        if (!ORDER_STATUSES.includes(orderStatus)) {
            return res.status(400).json({ message: "Invalid order status" });
        }

        // 🔹 Find order
        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // 🔹 Handle payment status based on order status
        if (orderStatus === "Delivered") {
            order.paymentStatus = "Paid";
        }

        if (orderStatus === "Cancelled") {
            order.paymentStatus = "Failed";
        }

        if (orderStatus === "Returned") {
            order.paymentStatus = "Refunded";
        }

        // 🔹 Update order status
        order.orderStatus = orderStatus;
        await order.save();

        return res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            order,
        });

    } catch (error) {
        console.error("Update order status error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};
