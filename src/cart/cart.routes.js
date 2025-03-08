// cart.routes.js
import { Router } from 'express';
import { validateJwt } from '../../middlewares/validate.jwt.js';
import {
    getCart,
    addItem,
    updateItem,
    removeItem,
    clearCart,
    checkout
} from './cart.controller.js';

const api = Router();

// Todas las rutas requieren autenticación
api.get('/', validateJwt, getCart);
api.post('/', validateJwt, addItem);
api.put('/:productId', validateJwt, updateItem);
api.delete('/:productId', validateJwt, removeItem);
api.delete('/', validateJwt, clearCart);

// Endpoint para checkout
api.post('/checkout', validateJwt, checkout);

export default api;
