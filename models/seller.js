import mongoose from "mongoose";

const SellerSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    accountName: {
        type: String,
        required: true
    },
}, { timestamps: true });

const Seller = mongoose.models.Seller || mongoose.model("Seller", SellerSchema);

export default Seller;

