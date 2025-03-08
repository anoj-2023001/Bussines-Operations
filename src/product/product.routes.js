import { Router } from 'express';
import { 
    createProduct,
    getAllProducts,
    getProduct,
    updateProduct,
    deleteProduct,
    getOutOfStockProducts,
    getBestSellingProducts 
} from './product.controller.js';
import { validateJwt, isAdmin } from '../../middlewares/validate.jwt.js';

const api = Router();

// Rutas estáticas primero
api.get('/out-of-stock', validateJwt, getOutOfStockProducts);
api.get('/best-selling', validateJwt, getBestSellingProducts);

// Crear un producto (solo ADMIN)
api.post('/', [validateJwt, isAdmin], createProduct);

// Obtener todos los productos (autenticados)
api.get('/', validateJwt, getAllProducts);

// Obtener un producto por ID (autenticado)
api.get('/:id', validateJwt, getProduct);

// Actualizar un producto (solo ADMIN)
api.put('/:id', [validateJwt, isAdmin], updateProduct);

// Eliminar un producto (solo ADMIN)
api.delete('/:id', [validateJwt, isAdmin], deleteProduct);

export default api;
