import express from "express"
import register from "../controller/auth/register.js";
import login from "../controller/auth/login.js";
import onBoard from "../controller/auth/onBoard.js";

const router = express.Router();
router.post("/register", register)
router.post("/login", login)
router.post("/onBoard", onBoard)

export default router