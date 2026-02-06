import jwt from "jsonwebtoken";

const middleware = (req, res, next) => {
    try {
        console.log("Auth middleware calling...");

        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(" ")[1];

        console.log("Token:", token);

        if (!token) {
            return res.status(401).json({
                message: "No token provided",
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded token:", decoded);

        if (!decoded?._id) {
            return res.status(401).json({
                message: "Invalid token",
            });
        }

        // Attach user id to request
        req.userId = decoded._id;

        next(); // 🔥 IMPORTANT
    } catch (error) {
        console.error("Auth middleware error:", error.message);
        return res.status(401).json({
            message: error.message,
        });
    }
};

export default middleware;
