// product.controller.js
import Product from './product.model.js';

export const createProduct = async (req, res) => {
    try {
        const { name, description, price, stock, category, image } = req.body;
        const newProduct = new Product({ name, description, price, stock, category, image });
        await newProduct.save();
        return res.status(201).send({
            success: true,
            message: "Producto creado exitosamente.",
            product: newProduct
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message: "Error al crear el producto.",
            error
        });
    }
};

export const getProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id).populate('category');
        if (!product) {
            return res.status(404).send({
                success: false,
                message: "Producto no encontrado."
            });
        }
        return res.send({
            success: true,
            product
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message: "Error al obtener el producto.",
            error
        });
    }
};

export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('category');
        return res.send({
            success: true,
            total: products.length,
            products
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message: "Error al obtener los productos.",
            error
        });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedProduct) {
            return res.status(404).send({
                success: false,
                message: "Producto no encontrado, no se pudo actualizar."
            });
        }
        return res.send({
            success: true,
            message: "Producto actualizado exitosamente.",
            product: updatedProduct
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message: "Error al actualizar el producto.",
            error
        });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).send({
                success: false,
                message: "Producto no encontrado, no se pudo eliminar."
            });
        }
        return res.send({
            success: true,
            message: "Producto eliminado exitosamente.",
            product: deletedProduct
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message: "Error al eliminar el producto.",
            error
        });
    }
};

export const getOutOfStockProducts = async (req, res) => {
    try {
        const products = await Product.find({ stock: 0 }).populate('category');
        return res.send({
            success: true,
            total: products.length,
            products,
            message: "Productos agotados obtenidos exitosamente."
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message: "Error al obtener productos agotados.",
            error
        });
    }
};

export const getBestSellingProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ sold: -1 }).limit(10).populate('category');
        return res.send({
            success: true,
            total: products.length,
            products,
            message: "Productos más vendidos obtenidos exitosamente."
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message: "Error al obtener productos más vendidos.",
            error
        });
    }
};
