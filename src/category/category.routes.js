import { Router } from 'express';
import { 
    createCategory,
    getCategory,
    getAllCategories,
    updateCategory,
    deleteCategory 
} from './category.controller.js';
import { validateJwt, isAdmin } from '../../middlewares/validate.jwt.js';

const api = Router();

// Crear una categoría (solo ADMIN)
api.post('/', [validateJwt, isAdmin], createCategory);

// Obtener todas las categorías (requiere autenticación)
api.get('/', validateJwt, getAllCategories);

// Obtener una categoría por ID (requiere autenticación)
api.get('/:id', validateJwt, getCategory);

// Actualizar una categoría (solo ADMIN)
api.put('/:id', [validateJwt, isAdmin], updateCategory);

// Eliminar una categoría (solo ADMIN)
api.delete('/:id', [validateJwt, isAdmin], deleteCategory);

export default api;
