// Validar campos en las rutas
import { body } from "express-validator"; // Capturar todo el body de la solicitud
import { validateErrorWithoutImg } from "./validate.error.js";
import { existEmail } from "./db.validators.js";

export const registerValidator = [
    body('username', 'Name cannot be empty')
        .notEmpty(),
    body('email', 'Email cannot be empty or is not a valid email')
        .notEmpty()
        .isEmail()
        .custom(existEmail),
    body('password', 'Password cannot be empty')
        .notEmpty()
        .isStrongPassword()
        .withMessage('The password must be strong')
        .isLength({ min: 8 }),
    validateErrorWithoutImg
];

export const loginValidator = [
    body('email', 'Username or email cannot be empty')
        .notEmpty()
        .toLowerCase(),
    body('password', 'Password cannot be empty')
        .notEmpty()
        .isStrongPassword()
        .withMessage('The password must be strong')
        .isLength({ min: 8 }),
    validateErrorWithoutImg
];

// Validación para actualizar datos del usuario (excepto contraseña y rol)
export const updateUserValidator = [
    body('email', 'If provided, email must be valid')
        .optional()
        .isEmail(),
    body('name', 'Name must be a non-empty string')
        .optional()
        .notEmpty(),
    validateErrorWithoutImg
];

// Validación para actualizar la contraseña
export const updatePasswordValidator = [
    body('currentPassword', 'Current password is required')
        .notEmpty(),
    body('newPassword', 'New password must be at least 8 characters long')
        .notEmpty()
        .isLength({ min: 8 }),
    validateErrorWithoutImg
];