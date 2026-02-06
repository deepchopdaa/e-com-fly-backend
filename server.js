import dotenv from "dotenv";
dotenv.config();
import express from "express";
import connectDb from "./config/db.js"
import auth from "./routes/auth.route.js"
import chat from "./routes/chat.route.js"
import admin from "./routes/admin.route.js"
import order from "./routes/order.route.js"
import Seller from "./routes/seller.route.js"
import user from "./routes/user.route.js"
import cors from "cors"
connectDb()
const app = express();
app.use(cors({
    origin: "http://localhost:3000", // frontend URL
    credentials: true
}));
app.use((req, res, next) => {
    if (req.headers["content-type"]?.startsWith("multipart/form-data")) {
        return next();
    }
    express.json()(req, res, next);
});

app.use(express.urlencoded({ extended: true })); app.use(express.urlencoded({ extended: true }));
const port = process.env.PORT || 5000;

app.use("/auth", auth)
app.use("/chat", chat)
app.use("/admin", admin)
app.use("/orders", order)
app.use("/seller", Seller)
app.use("/user", user)


app.listen(port, () => {
    console.log(`App running on port ${port}`);
});
