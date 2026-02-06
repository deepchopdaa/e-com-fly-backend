import Order from "../../models/order.js";
import Product from "../../models/product.js";

/**
 * @desc    Create Order
 * @access  Private
 */
export const createOrder = async (req, res) => {
    try {

        // In real apps, userId comes from JWT middleware
        const userId = req.userid;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { orderItems, shippingAddress, paymentMethod = "COD" } = req.body;

        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({ message: "Order items required" });
        }

        let itemsPrice = 0;
        const validatedItems = [];

        for (const item of orderItems) {
            const product = await Product.findOneAndUpdate(
                {
                    _id: item.product,
                    stock: { $gte: item.qty },
                },
                {
                    $inc: { stock: -item.qty },
                },
                { new: true }
            );

            if (!product) {
                return res.status(400).json({
                    message: "Product out of stock"
                });
            }

            itemsPrice += product.discountPrice * item.qty;

            validatedItems.push({
                product: product._id,
                name: product.name,
                image: product.image || "",
                qty: item.qty,
                price: product.discountPrice,
                sellerId: product.sellerId,
            });
        }

        const shippingPrice = itemsPrice > 1000 ? 0 : 50;
        const taxPrice = Math.round(itemsPrice * 0.10);
        const totalPrice = itemsPrice + shippingPrice + taxPrice;

        const order = await Order.create({
            user: userId,
            orderItems: validatedItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            shippingPrice,
            taxPrice,
            totalPrice,
        });

        return res.status(201).json({
            message: "Order placed successfully",
            order,
        });

    } catch (error) {
        console.error("Order Create Error:", error.message);
        return res.status(400).json({ message: error.message });
    }
};

/**
 * @desc    Get User Orders
 * @access  Private
 */
export const getUserOrders = async (req, res) => {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const orders = await Order.find({ user: userId })
            .sort({ createdAt: -1 });

        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: "No orders found" });
        }

        return res.status(200).json({ orders });

    } catch (error) {
        console.error("Order Fetch Error:", error.message);
        return res.status(500).json({ message: error.message });
    }
};

/**
 * @desc    Get order by ID
 * @route   GET /api/orders/:id
 * @access  Private
 */
export const getOrderById = async (req, res) => {
    try {

        const { id } = req.params;

        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        return res.status(200).json({ order });

    } catch (error) {
        console.error("Get Order Error:", error.message);
        return res.status(500).json({ message: error.message });
    }
};

/**
 * @desc    Update order status
 * @route   PUT /api/orders/:id
 * @access  Admin / Seller
 */
export const updateOrderStatus = async (req, res) => {
    try {

        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = [
            "Pending",
            "Confirmed",
            "Packed",
            "Shipped",
            "Out for Delivery",
            "Delivered",
            "Cancelled",
            "Returned"
        ];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid order status" });
        }

        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        order.orderStatus = status;

        if (status === "Delivered") {
            order.deliveredAt = new Date();
            order.paymentStatus = "Paid";
            order.paidAt = new Date();
        }

        await order.save();

        return res.status(200).json({
            message: "Order updated",
            order
        });

    } catch (error) {
        console.error("Update Order Error:", error.message);
        return res.status(500).json({ message: error.message });
    }
};

/**
 * @desc    Delete order
 * @route   DELETE /api/orders/:id
 * @access  Admin
 */
export const deleteOrder = async (req, res) => {
    try {

        const { id } = req.params;

        const deletedOrder = await Order.findByIdAndDelete(id);

        if (!deletedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }

        return res.status(200).json({ message: "Order deleted" });

    } catch (error) {
        console.error("Delete Order Error:", error.message);
        return res.status(500).json({ message: error.message });
    }
};
