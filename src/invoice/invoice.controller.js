// invoice.controller.js
import Invoice from './invoice.model.js';
import Product from '../product/product.model.js';

export const createInvoice = async (req, res) => {
    try {
        const { user, items, total, status } = req.body;
        // Validar stock para cada item
        for (let item of items) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).send({
                    success: false,
                    message: `Producto con ID ${item.product} no encontrado.`
                });
            }
            if (product.stock < item.quantity) {
                return res.status(400).send({
                    success: false,
                    message: `Stock insuficiente para el producto ${product.name}.`
                });
            }
        }
        // Reducir stock y aumentar el recuento de vendidos
        for (let item of items) {
            const product = await Product.findById(item.product);
            product.stock -= item.quantity;
            product.sold += item.quantity;
            await product.save();
        }
        // Crear la factura
        const newInvoice = new Invoice({ user, items, total, status });
        await newInvoice.save();
        return res.status(201).send({
            success: true,
            message: "Factura creada exitosamente.",
            invoice: newInvoice
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message: "Error al crear la factura.",
            error
        });
    }
};

export const updateInvoice = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        // Si se modifican los items, se podría agregar lógica para validar stock nuevamente
        const updatedInvoice = await Invoice.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedInvoice) {
            return res.status(404).send({
                success: false,
                message: "Factura no encontrada, no se pudo actualizar."
            });
        }
        return res.send({
            success: true,
            message: "Factura actualizada exitosamente.",
            invoice: updatedInvoice
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message: "Error al actualizar la factura.",
            error
        });
    }
};

export const getInvoice = async (req, res) => {
    try {
        const { id } = req.params;
        const invoice = await Invoice.findById(id)
            .populate({
                path: 'user',
                select: 'username email -_id'
            })
            .populate({
                path: 'items.product',
                select: 'name price -_id'
            });
        if (!invoice) {
            return res.status(404).send({
                success: false,
                message: "Factura no encontrada."
            });
        }
        return res.send({
            success: true,
            invoice
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message: "Error al obtener la factura.",
            error
        });
    }
};

export const getInvoicesByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const invoices = await Invoice.find({ user: userId })
            .populate({
                path: 'items.product',
                select: 'name price -_id'
            });
        if (!invoices || invoices.length === 0) {
            return res.status(404).send({
                success: false,
                message: "No se encontraron facturas para este usuario."
            });
        }
        return res.send({
            success: true,
            total: invoices.length,
            invoices
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message: "Error al obtener las facturas del usuario.",
            error
        });
    }
};

export const getAllInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find()
            .populate({
                path: 'user',
                select: 'username email -_id'
            })
            .populate({
                path: 'items.product',
                select: 'name price -_id'
            });
        return res.send({
            success: true,
            total: invoices.length,
            invoices
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message: "Error al obtener las facturas.",
            error
        });
    }
};
