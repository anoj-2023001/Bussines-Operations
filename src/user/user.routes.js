// user.routes.js
import { Router } from 'express';
import {
    updateUserRole,
    updateUser,
    deleteUser,
    updatePassword,
    getAllUsers,
    getPurchaseHistory
} from './user.controller.js';
import { validateJwt, isAdmin } from '../../middlewares/validate.jwt.js';
import { updateUserValidator, updatePasswordValidator } from '../../helpers/validators.js';

const api = Router();

// Obtener todos los usuarios con paginación
api.get('/all', validateJwt, getAllUsers);

// Obtener el historial de compras del usuario autenticado
api.get('/purchase-history', validateJwt, getPurchaseHistory);

// Actualizar datos del usuario (excepto rol y contraseña)
api.put('/update/:id', 
    [
        validateJwt, 
        updateUserValidator
    ], 
    updateUser
);

// Actualizar rol de un usuario (solo ADMIN puede realizar esta acción)
api.put('/update-role/:id', 
    [
        validateJwt, 
        isAdmin
    ], 
    updateUserRole
);

// Actualizar contraseña (solo el usuario autenticado puede hacerlo)
api.put('/update-password/:id', 
    [
        validateJwt, 
        updatePasswordValidator
    ], 
    updatePassword
);

// Eliminar usuario (verifica si es él mismo o si es ADMIN, con restricciones)
api.delete('/delete/:id', validateJwt, deleteUser);

export default api;
