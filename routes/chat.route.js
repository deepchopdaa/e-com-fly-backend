import express from "express"
import chat from "../controller/chat/chatbot.js";
const router = express.Router();

router.post("/sendmessage", chat)

export default router