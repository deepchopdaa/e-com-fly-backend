import express from "express"
import middleware from "../middleware/middleware.js";
import multer from "multer";
import { updateOrderStatus, getSellerOrders } from "../controller/seller/myorders.js";
import {
    createProduct,
    getSellerProducts,
    deleteProduct,
    updateProduct,
} from "../controller/seller/products.js";
import { getSellerProfile, updateSellerProfile } from "../controller/seller/profile.js";
import { createBranch, deleteBranch, setPrimaryBranch } from "../controller/seller/branch.js";

const router = express.Router();
const upload = multer({
    storage: multer.diskStorage({}),
    limits: { fileSize: 10 * 1024 * 1024 }, // 5MB
});

/* seller orders routes */
router.get("/myorders", middleware, getSellerOrders)
router.put("/myorders/:id", middleware, updateOrderStatus)

/* seller products routes */
router.post("/product", middleware, upload.single("image"), createProduct);
router.get("/product", middleware, getSellerProducts);
router.delete("/product/:id", middleware, deleteProduct);
router.put("/product/:id", middleware, upload.single("image"), updateProduct);

/* seller profile manage + brach */
// router.post("/createSellerWithBranches", middleware, createSellerWithBranches);
router.get("/profile", middleware, getSellerProfile);
router.put("/profile/:id", updateSellerProfile);

/* sellers branches */
router.post("/branch", createBranch);
router.put("/branch", setPrimaryBranch);
router.delete("/branch/:id", deleteBranch);

export default router