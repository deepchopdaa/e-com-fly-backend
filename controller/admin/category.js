import Category from "../../models/category.js";

/**
 * @desc    Get all categories
 * @route   GET /api/categories
 */
export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        return res.status(200).json(categories);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

/**
 * @desc    Create new category
 * @route   POST /api/categories
 */
export const createCategory = async (req, res) => {
    try {
        const data = req.body;
        const newCategory = await Category.create(data);
        return res.status(201).json(newCategory);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

/**
 * @desc    Get category by ID
 * @route   GET /api/categories/:id
 */
export const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findById(id);

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        return res.status(200).json(category);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

/**
 * @desc    Update category
 * @route   PUT /api/categories/:id
 */
export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        const updatedCategory = await Category.findByIdAndUpdate(
            id,
            data,
            { new: true }
        );

        if (!updatedCategory) {
            return res.status(404).json({ message: "Category not found" });
        }

        return res.status(200).json(updatedCategory);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

/**
 * @desc    Delete category
 * @route   DELETE /api/categories/:id
 */
export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await Category.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({ message: "Category not found" });
        }

        return res.status(200).json({ message: "Deleted Successfully" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
