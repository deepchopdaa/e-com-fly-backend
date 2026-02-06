import mongoose from "mongoose";

const BrandSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Brand name is required"],
            unique: true,
            trim: true,
            minlength: [2, "Brand name must be at least 2 characters"],
            maxlength: [50, "Brand name must be at most 50 characters"],
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

export default mongoose.models.Brand || mongoose.model("Brand", BrandSchema);
