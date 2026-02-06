import express from "express"
import middleware from "../middleware/middleware.js";
import { getProducts, getProductById } from "../controller/user/products.js";
import { getAllSellers, getSellerBranches, getSellerProducts } from "../controller/user/productBySellers.js"
import { getUserProfile, updateUserProfile } from "../controller/user/profile.js"
import { getAllReviews, getReviewsByProduct, addReview } from "../controller/user/review.js"
import { ProductDetail, productIds } from "../controller/user/ProductDetail.js";
const router = express.Router();

/* all products */
router.get("/getProducts", getProducts)
router.get("/getProducts/:id", ProductDetail)
router.get("/productsIds", productIds)

/* seller according products */

router.get("/sellers", getAllSellers)
router.get("/sellers/:id", getSellerBranches)
router.get("/sellers/products", getSellerProducts);

/* user review section */
router.get("/getAllReviews", getAllReviews);
router.get("/product/:id", getReviewsByProduct);
router.post("/addReview", addReview);

/* user profile */

router.get("/profile", middleware, getUserProfile);
router.put("/profile", updateUserProfile);
export default router