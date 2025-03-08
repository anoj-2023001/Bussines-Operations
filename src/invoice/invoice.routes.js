import { Router } from 'express';
import { 
    createInvoice,
    updateInvoice,
    getInvoice,
    getInvoicesByUser,
    getAllInvoices 
} from './invoice.controller.js';
import { validateJwt, isAdmin } from '../../middlewares/validate.jwt.js';

const api = Router();

// Crear una factura (puede ser realizada por cualquier usuario autenticado)
api.post('/', validateJwt, createInvoice);

// Actualizar una factura (solo ADMIN puede editarla)
api.put('/:id', [validateJwt, isAdmin], updateInvoice);

// Obtener todas las facturas (solo ADMIN)
api.get('/', [validateJwt, isAdmin], getAllInvoices);

// Obtener facturas de un usuario específico (solo ADMIN)
api.get('/by-user/:userId', [validateJwt, isAdmin], getInvoicesByUser);

// Obtener una factura por ID (accesible para el propietario o ADMIN)
// En una implementación más completa se validaría que el usuario sea el dueño de la factura si no es ADMIN.
api.get('/:id', validateJwt, getInvoice);

export default api;
