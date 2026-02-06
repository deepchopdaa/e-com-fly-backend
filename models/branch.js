import mongoose from "mongoose";

const branchSchema = new mongoose.Schema({
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Seller",
        required: true,
    },
    branchName: {
        type: String,
        required: true
    },
    contactNo: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    pincode: {
        type: String,
        required: true,
    },
    primary: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });
const Branch = mongoose.models.Branch || mongoose.model("Branch", branchSchema);

export default Branch;