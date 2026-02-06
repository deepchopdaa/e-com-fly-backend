import express from "express"
import { createBrand, getBrands, getBrandById, updateBrand, deleteBrand } from "../controller/admin/brand.js";
import { createCategory, getCategories, getCategoryById, updateCategory, deleteCategory } from "../controller/admin/category.js";
import { getAllSellers } from "../controller/admin/sellerList.js";
const router = express.Router();

/* category */
router.post("/brand", createBrand)
router.get("/brand", getBrands)
router.get("/getBrandById/:id", getBrandById)
router.put("/brand/:id", updateBrand)
router.delete("/brand/:id", deleteBrand)
/* brand */
router.post("/category", createCategory)
router.get("/category", getCategories)
router.get("/getCategoryById/:id", getCategoryById)
router.put("/category/:id", updateCategory)
router.delete("/category/:id", deleteCategory)

/* sellerList */

router.get("/sellerList", getAllSellers)
export default router