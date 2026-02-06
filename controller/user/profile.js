import User from "../../models/user.js";

/**
 * @desc    Get user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
export const getUserProfile = async (req, res) => {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ user });
    } catch (error) {
        console.error("Get user profile error:", error.message);
        return res.status(500).json({ message: "Server error" });
    }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
export const updateUserProfile = async (req, res) => {
    try {
        const { name, email } = req.body;
        const userId = req.body.userId || req.userid;

        if (!name || !email || !userId) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findById(userId);
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const emailExists = await User.findOne({ email });
        if (emailExists && emailExists._id.toString() !== userId) {
            return res.status(400).json({ message: "This email already exists. Try a different one." });
        }

        existingUser.name = name;
        existingUser.email = email;

        const updatedUser = await existingUser.save();

        return res.status(200).json({
            user: {
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email
            }
        });

    } catch (error) {
        console.error("Update user profile error:", error.message);
        return res.status(500).json({ message: error.message });
    }
};
