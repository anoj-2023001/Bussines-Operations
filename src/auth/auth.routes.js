// Rutas de autenticación
import { Router } from 'express';
import { login, register, test } from './auth.controller.js';
import { validateJwt } from '../../middlewares/validate.jwt.js';
import { loginValidator, registerValidator } from '../../helpers/validators.js';

const api = Router();

// Rutas públicas
api.post('/register', registerValidator, register);
api.post('/login', loginValidator, login);

// Rutas privadas (requieren token válido)
api.get('/test', validateJwt, test);

export default api;
