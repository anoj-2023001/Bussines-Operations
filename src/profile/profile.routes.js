// profile.routes.js
import { Router } from 'express';
import { validateJwt } from '../../middlewares/validate.jwt.js';
import { getProfile, updateProfile } from './profile.controller.js';

const api = Router();

// Obtener perfil del usuario autenticado
api.get('/', validateJwt, getProfile);

// Actualizar perfil del usuario autenticado
api.put('/', validateJwt, updateProfile);

export default api;
