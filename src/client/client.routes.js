// client.routes.js
import { Router } from 'express';
import { validateJwt } from '../../middlewares/validate.jwt.js';
import {
    searchProducts,
    getCategories,
    getBestSellingProducts
} from './client.controller.js';

const api = Router();

// Todas las rutas de cliente requieren autenticación
api.get('/products', validateJwt, searchProducts);
api.get('/products/best-sellers', validateJwt, getBestSellingProducts);
api.get('/categories', validateJwt, getCategories);

export default api;
