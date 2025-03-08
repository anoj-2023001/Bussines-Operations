// cart.controller.js
import Cart from './cart.model.js';
import Product from '../product/product.model.js';
import Invoice from '../invoice/invoice.model.js'; // Para crear facturas en checkout

// Obtener el carrito del usuario autenticado
export const getCart = async (req, res) => {
    try {
        const userId = req.user.uid;
        let cart = await Cart.findOne({ user: userId }).populate('items.product');
        // Si el usuario no tiene carrito, crear uno vacío
        if (!cart) {
            cart = new Cart({ user: userId, items: [] });
            await cart.save();
        }
        return res.send({
            success: true,
            message: 'Cart retrieved successfully.',
            cart
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message: 'Error retrieving cart.',
            error
        });
    }
};

// Agregar un producto al carrito
export const addItem = async (req, res) => {
    try {
        const userId = req.user.uid;
        const { productId, quantity } = req.body;

        // Validar que el producto exista
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).send({
                success: false,
                message: 'Product not found.'
            });
        }

        // Buscar o crear el carrito del usuario
        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            cart = new Cart({ user: userId, items: [] });
        }

        // Verificar si el producto ya existe en el carrito
        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
        if (itemIndex !== -1) {
            // Actualizar cantidad
            cart.items[itemIndex].quantity += (quantity || 1);
        } else {
            // Agregar producto nuevo
            cart.items.push({ product: productId, quantity: quantity || 1 });
        }

        await cart.save();
        return res.status(201).send({
            success: true,
            message: 'Item added to cart.',
            cart
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message: 'Error adding item to cart.',
            error
        });
    }
};

// Actualizar la cantidad de un producto en el carrito
export const updateItem = async (req, res) => {
    try {
        const userId = req.user.uid;
        const { productId } = req.params;
        const { quantity } = req.body;

        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).send({
                success: false,
                message: 'Cart not found.'
            });
        }

        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
        if (itemIndex === -1) {
            return res.status(404).send({
                success: false,
                message: 'Item not found in cart.'
            });
        }

        cart.items[itemIndex].quantity = quantity;
        await cart.save();

        return res.send({
            success: true,
            message: 'Cart item updated successfully.',
            cart
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message: 'Error updating cart item.',
            error
        });
    }
};

// Eliminar un producto del carrito
export const removeItem = async (req, res) => {
    try {
        const userId = req.user.uid;
        const { productId } = req.params;

        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).send({
                success: false,
                message: 'Cart not found.'
            });
        }

        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
        if (itemIndex === -1) {
            return res.status(404).send({
                success: false,
                message: 'Item not found in cart.'
            });
        }

        cart.items.splice(itemIndex, 1);
        await cart.save();

        return res.send({
            success: true,
            message: 'Item removed from cart.',
            cart
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message: 'Error removing item from cart.',
            error
        });
    }
};

// Vaciar todo el carrito
export const clearCart = async (req, res) => {
    try {
        const userId = req.user.uid;
        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).send({
                success: false,
                message: 'Cart not found.'
            });
        }

        cart.items = [];
        await cart.save();

        return res.send({
            success: true,
            message: 'Cart cleared successfully.',
            cart
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message: 'Error clearing cart.',
            error
        });
    }
};

// Checkout: genera la factura a partir del carrito
export const checkout = async (req, res) => {
    try {
        const userId = req.user.uid;
        let cart = await Cart.findOne({ user: userId }).populate('items.product');
        if (!cart || cart.items.length === 0) {
            return res.status(400).send({
                success: false,
                message: 'Cart is empty or does not exist.'
            });
        }

        // Validar stock para cada producto
        for (const item of cart.items) {
            if (item.product.stock < item.quantity) {
                return res.status(400).send({
                    success: false,
                    message: `Not enough stock for product ${item.product.name}.`
                });
            }
        }

        // Actualizar stock y sold
        let total = 0;
        for (const item of cart.items) {
            item.product.stock -= item.quantity;
            item.product.sold += item.quantity;
            await item.product.save();
            total += (item.product.price * item.quantity);
        }

        // Crear la factura
        const newInvoice = new Invoice({
            user: userId,
            items: cart.items.map(i => ({
                product: i.product._id,
                quantity: i.quantity,
                price: i.product.price
            })),
            total,
            status: 'completed'
        });
        await newInvoice.save();

        // Vaciar el carrito tras la compra
        cart.items = [];
        await cart.save();

        return res.send({
            success: true,
            message: 'Checkout successful. Invoice created.',
            invoice: newInvoice
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message: 'Error during checkout.',
            error
        });
    }
};
