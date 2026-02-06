import Seller from "../../models/seller.js";
import Branch from "../../models/branch.js";
import User from "../../models/user.js";

// ================= CREATE SELLER + BRANCHES =================
/* export const createSellerWithBranches = async (req, res) => {
    try {
        const { seller, branches } = req.body;
        const userId = req.userId;

        if (!seller || !branches || branches.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Seller and branches are required",
            });
        }

        // Create Seller
        const createdSeller = await Seller.create({
            user: userId,
            accountName: seller.accountName,
        });

        const sellerId = createdSeller._id;

        // Create Branches
        const branchDocs = branches.map((branch, index) => ({
            sellerId,
            branchName: branch.branchName,
            address: branch.address,
            city: branch.city,
            state: branch.state,
            country: branch.country,
            pincode: branch.pincode,
            primary: index === 0,
        }));

        await Branch.insertMany(branchDocs);

        res.status(201).json({
            success: true,
            message: "Seller and branches created successfully",
            sellerId,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
 */
// ================= GET SELLER PROFILE =================
export const getSellerProfile = async (req, res) => {
    try {
        const userId = req.userId;

        const seller = await Seller.findOne({ user: userId })
            .populate("user", "name email");

        if (!seller) {
            return res.status(404).json({
                success: false,
                message: "Seller not found",
            });
        }

        const branches = await Branch.find({ sellerId: seller._id });

        res.status(200).json({
            success: true,
            data: {
                seller,
                branches,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= UPDATE SELLER + USER =================
export const updateSellerProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const { accountName, userName, userEmail } = req.body;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Seller ID is required",
            });
        }

        const seller = await Seller.findById(id);
        if (!seller) {
            return res.status(404).json({
                success: false,
                message: "Seller not found",
            });
        }

        if (accountName) {
            seller.accountName = accountName;
            await seller.save();
        }

        if (seller.user) {
            const user = await User.findById(seller.user);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found",
                });
            }

            if (userName) user.name = userName;
            if (userEmail) user.email = userEmail;
            await user.save();
        }

        res.status(200).json({
            success: true,
            message: "Seller and User updated successfully",
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
