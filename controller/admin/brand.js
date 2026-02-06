import Brand from "../../models/brand.js";

/**
 * @desc    Get all brands
 * @route   GET /api/brands
 */
export const getBrands = async (req, res) => {
    try {
        const brands = await Brand.find();
        return res.status(200).json(brands);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

/**
 * @desc    Create new brand
 * @route   POST /api/brands
 */
export const createBrand = async (req, res) => {
    try {
        const data = req.body;
        const newBrand = await Brand.create(data);
        return res.status(201).json(newBrand);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

/**
 * @desc    Get brand by ID
 * @route   GET /api/brands/:id
 */
export const getBrandById = async (req, res) => {
    try {
        const { id } = req.params;
        const brand = await Brand.findById(id);

        if (!brand) {
            return res.status(404).json({ message: "Brand not found" });
        }

        return res.status(200).json(brand);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

/**
 * @desc    Update brand
 * @route   PUT /api/brands/:id
 */
export const updateBrand = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        const updatedBrand = await Brand.findByIdAndUpdate(
            id,
            data,
            { new: true }
        );

        if (!updatedBrand) {
            return res.status(404).json({ message: "Brand not found" });
        }

        return res.status(200).json(updatedBrand);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

/**
 * @desc    Delete brand
 * @route   DELETE /api/brands/:id
 */
export const deleteBrand = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await Brand.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({ message: "Brand not found" });
        }

        return res.status(200).json({ message: "Deleted Successfully" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
