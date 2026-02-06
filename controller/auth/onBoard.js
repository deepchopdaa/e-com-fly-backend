import express from "express";
import mongoose from "mongoose";
import Seller from "../../models/seller.js";
import Branch from "../../models/branch.js";


const onBoard = async (req, res) => {
    try {

        const { seller, branches } = req.body;
        const userId = req.headers.authorization;

        if (!userId) {
            return res.status(401).json({ success: false, message: "Not authorized" });
        }

        if (!seller || !branches || branches.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Seller and branches are required"
            });
        }

        // 🔹 Create Seller
        const createdSeller = await Seller.create({
            user: new mongoose.Types.ObjectId(userId),
            accountName: seller.accountName
        });

        const sellerId = createdSeller._id;

        // 🔹 Create Branches
        const branchDocs = branches.map((branch, index) => ({
            sellerId,
            branchName: branch.branchName,
            address: branch.address,
            contactNo: branch.contactNo,
            city: branch.city,
            state: branch.state,
            country: branch.country,
            pincode: branch.pincode,
            primary: index === 0
        }));

        await Branch.insertMany(branchDocs);

        res.status(201).json({
            success: true,
            message: "Seller and branches created successfully",
            sellerId
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export default onBoard;
