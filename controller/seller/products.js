import Product from "../../models/product.js";
import Seller from "../../models/seller.js";
import cloudinary from "../../config/cloudinary.js";
import mongoose from "mongoose";

// ================= CREATE PRODUCT =================
export const createProduct = async (req, res) => {
    try {
        const userId = req.userId;

        const seller = await Seller.findOne({ user: userId });
        if (!seller) {
            return res.status(404).json({ message: "Seller not found" });
        }

        const {
            name,
            branch,
            price,
            brand,
            discountPrice,
            description,
            category,
            stock,
        } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: "Image is required" });
        }

        const upload = await cloudinary.uploader.upload(req.file.path, {
            folder: "ecommerce/products",
        });

        const product = await Product.create({
            name,
            sellerId: seller._id,
            branch,
            price,
            brand,
            discountPrice,
            description,
            category,
            stock,
            image: {
                url: upload.secure_url,
                public_id: upload.public_id,
            },
        });

        res.status(201).json({
            message: "Product created successfully",
            product,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ================= GET SELLER PRODUCTS =================
export const getSellerProducts = async (req, res) => {
    try {
        const seller = await Seller.findOne({ user: req.userId });
        if (!seller) {
            return res.status(404).json({ message: "Seller not found" });
        }

        const products = await Product.find({ sellerId: seller._id })
            .populate("category", "name")
            .populate("brand", "name")
            .populate("branch", "branchName")
            .sort({ createdAt: -1 });

        res.status(200).json({ products });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// ================= DELETE PRODUCT =================
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (product.image?.public_id) {
            await cloudinary.uploader.destroy(product.image.public_id);
        }

        await Product.findByIdAndDelete(id);

        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// ================= UPDATE PRODUCT =================
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(id, 'product id')
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid product ID" });
        }

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        let image = product.image;

        if (req.file) {
            const upload = await cloudinary.uploader.upload(req.file.path, {
                folder: "ecommerce/products",
            });

            if (product.image?.public_id) {
                await cloudinary.uploader.destroy(product.image.public_id);
            }

            image = {
                url: upload.secure_url,
                public_id: upload.public_id,
            };
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { ...req.body, image },
            { new: true }
        );

        res.status(200).json({
            message: "Product updated successfully",
            product: updatedProduct,
        });
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ message: error.message || "something went wrong" })
    }
};
