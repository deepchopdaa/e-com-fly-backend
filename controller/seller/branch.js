import Branch from "../../models/branch.js";

// ================= CREATE BRANCH =================
export const createBranch = async (req, res) => {
    try {
        const branch = await Branch.create(req.body);
        res.status(201).json({
            success: true,
            data: branch,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= SET PRIMARY BRANCH =================
export const setPrimaryBranch = async (req, res) => {
    try {
        const { sellerId, branchId } = req.body;

        await Branch.updateMany(
            { sellerId },
            { $set: { primary: false } }
        );

        await Branch.findByIdAndUpdate(branchId, { primary: true });

        res.status(200).json({
            success: true,
            message: "Primary branch updated successfully",
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= DELETE BRANCH =================
export const deleteBranch = async (req, res) => {
    try {
        const { id } = req.params;

        const branch = await Branch.findByIdAndDelete(id);
        if (!branch) {
            return res.status(404).json({
                success: false,
                message: "Branch not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Branch deleted successfully",
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
