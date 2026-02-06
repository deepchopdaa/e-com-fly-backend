import mongoose from "mongoose";

const connectDB = async () => {


    if (!process.env.MONGODB_URI) {
        throw new Error("MONGODB_URI not found in .env file");
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ MongoDB Connected");
    } catch (error) {
        console.error("❌ MongoDB connection failed:", error.message);
        process.exit(1);
    }
};

export default connectDB;
