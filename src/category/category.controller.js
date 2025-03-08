// category.controller.js
import Category from './category.model.js';
import Product from '../product/product.model.js';

export const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        const newCategory = new Category({ name, description });
        await newCategory.save();
        return res.status(201).send({
            success: true,
            message: "Categoría creada exitosamente.",
            category: newCategory
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message: "Error al crear la categoría.",
            error
        });
    }
};

export const getCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).send({
                success: false,
                message: "Categoría no encontrada."
            });
        }
        return res.send({
            success: true,
            category
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message: "Error al obtener la categoría.",
            error
        });
    }
};

export const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        return res.send({
            success: true,
            total: categories.length,
            categories
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message: "Error al obtener las categorías.",
            error
        });
    }
};

export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const updatedCategory = await Category.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedCategory) {
            return res.status(404).send({
                success: false,
                message: "Categoría no encontrada, no se pudo actualizar."
            });
        }
        return res.send({
            success: true,
            message: "Categoría actualizada exitosamente.",
            category: updatedCategory
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message: "Error al actualizar la categoría.",
            error
        });
    }
};

export const deleteCategory = async (req, res) => {
    const { id } = req.params;
    try {
        // Buscar o crear la categoría por defecto
        let defaultCategory = await Category.findOne({ name: "Default" });
        if (!defaultCategory) {
            defaultCategory = new Category({ name: "Default", description: "Categoría por defecto" });
            await defaultCategory.save();
        }
        // Reasignar productos asociados a la categoría a eliminar a la categoría por defecto
        await Product.updateMany({ category: id }, { category: defaultCategory._id });
        const deletedCategory = await Category.findByIdAndDelete(id);
        if (!deletedCategory) {
            return res.status(404).send({
                success: false,
                message: "Categoría no encontrada, no se pudo eliminar."
            });
        }
        return res.send({
            success: true,
            message: "Categoría eliminada exitosamente y productos reasignados a la categoría por defecto.",
            category: deletedCategory
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message: "Error al eliminar la categoría.",
            error
        });
    }
};
