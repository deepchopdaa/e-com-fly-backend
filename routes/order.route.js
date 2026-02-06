import express from "express"
import { createOrder, getUserOrders, getOrderById, updateOrderStatus, deleteOrder } from "../controller/order/order.js";
import middleware from "../middleware/middleware.js";
const router = express.Router();

router.post("/createOrder", middleware, createOrder)
router.get("/getmyOrders", middleware, getUserOrders)
router.get("/getOrderById/:id", getOrderById)
router.patch("/updateOrderStatus/:id", updateOrderStatus)
router.delete("/deleteOrder/:id", deleteOrder)

export default router