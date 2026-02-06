import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../../models/user.js";


const login = async (req, res) => {
    try {
        console.log(req.body, 'body')
        const { email, password } = await req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existUser = await User.findOne({ email });
        if (!existUser) {
            return res.status(404).json({ message: "User not found, please register" });
        }

        const passwordMatch = await bcrypt.compare(password, existUser.password);
        if (!passwordMatch) {
            return res.status(400).json({ message: "Password not match" });
        }

        const token = jwt.sign(
            { _id: existUser._id },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        res.status(200).json({
            message: "Login successfully",
            token,
            userRole: existUser.role
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

export default login;
