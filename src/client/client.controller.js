// client.controller.js
import Product from '../product/product.model.js';
import Category from '../category/category.model.js';

/**
 * Búsqueda y/o filtrado de productos.
 * GET /client/products?name=xyz&category=abc
 */
export const searchProducts = async (req, res) => {
    try {
        const { name, category } = req.query;
        const query = {};

        // Filtro por nombre (busqueda parcial, case-insensitive)
        if (name) {
            query.name = { $regex: name, $options: 'i' };
        }

        // Filtro por categoría
        if (category) {
            query.category = category;
        }

        const products = await Product.find(query).populate('category');
        return res.send({
            success: true,
            total: products.length,
            products
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message: 'Error searching products.',
            error
        });
    }
};

/**
 * Obtención de todas las categorías disponibles (para filtrar).
 */
export const getCategories = async (req, res) => {
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
            message: 'Error retrieving categories.',
            error
        });
    }
};

/**
 * Obtener los productos más vendidos (top 10).
 */
export const getBestSellingProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ sold: -1 }).limit(10).populate('category');
        return res.send({
            success: true,
            total: products.length,
            products
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message: 'Error retrieving best-selling products.',
            error
        });
    }
};
