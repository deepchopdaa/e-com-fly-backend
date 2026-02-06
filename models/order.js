import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        orderItems: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                name: { type: String, required: true },
                image: {
                    url: {
                        type: String,
                        required: true
                    },
                    public_id: {
                        type: String,
                        required: true
                    }
                },
                qty: { type: Number, required: true },
                price: { type: Number, required: true },
                sellerId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Seller",
                    required: true,
                }
            },
        ],

        shippingAddress: {
            fullName: { type: String, required: true },
            phone: { type: String, required: true },
            address: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String, required: true },
            postalCode: { type: String, required: true },
            country: { type: String, default: "India" },
        },

        paymentMethod: {
            type: String,
            enum: ["COD", "Card", "UPI", "NetBanking"],
            default: "COD",
        },

        paymentStatus: {
            type: String,
            enum: ["Pending", "Paid", "Failed", "Refunded"],
            default: "Pending",
        },

        orderStatus: {
            type: String,
            enum: [
                    "Pending",
                    "Confirmed",
                    "Packed",
                    "Shipped",
                    "Out for Delivery",
                    "Delivered",
                    "Cancelled",
                    "Returned",
            ],
            default: "Pending",
        },

        itemsPrice: { type: Number, required: true },
        shippingPrice: { type: Number, required: true },
        taxPrice: { type: Number, default: 0 },
        totalPrice: { type: Number, required: true },

        deliveredAt: { type: Date },
        paidAt: { type: Date },
    },
    { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", orderSchema);
