// user.controller.js
import { checkPassword, encrypt } from '../../utils/encrypt.js';
import User from '../user/user.model.js';
import Invoice from '../invoice/invoice.model.js';

/**
 * Actualización del rol de un usuario.
 * Solo un ADMIN puede actualizar el rol de un usuario.
 */
export const updateUserRole = async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    try {
        // Validar que se envíe un rol válido.
        if (!role || !['ADMIN', 'CLIENT'].includes(role)) {
            return res.status(400).send({
                success: false,
                message: 'Se debe proporcionar un rol válido (ADMIN o CLIENT).'
            });
        }

        // Actualizar el rol del usuario.
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { role },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).send({
                success: false,
                message: 'Usuario no encontrado; rol no actualizado.'
            });
        }

        return res.send({
            success: true,
            message: 'Rol actualizado exitosamente.',
            user: updatedUser
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message: 'Error general al actualizar el rol.',
            error
        });
    }
};

/**
 * Actualización de datos de usuario (excepto rol y contraseña).
 * Un ADMIN solo puede actualizar usuarios que no sean otros ADMIN (salvo que sea él mismo).
 * Un CLIENTE solo puede actualizar su propio perfil.
 */
export const updateUser = async (req, res) => {
    const { id } = req.params;
    // Se excluyen 'role' y 'password' del cuerpo de la petición.
    const { role, password, ...updateData } = req.body;

    try {
        const currentUser = req.user; // Información inyectada por el middleware de validación de JWT.
        const targetUser = await User.findById(id);

        if (!targetUser) {
            return res.status(404).send({
                success: false,
                message: 'Usuario no encontrado, no se pudo actualizar.'
            });
        }

        // Regla: un ADMIN no puede modificar a otro ADMIN (excepto a sí mismo).
        if (currentUser.role === 'ADMIN' && targetUser.role === 'ADMIN' && currentUser.uid !== id) {
            return res.status(403).send({
                success: false,
                message: 'Los ADMIN no pueden modificar a otros ADMIN.'
            });
        }

        // Un usuario normal solo puede actualizar su propio perfil.
        if (currentUser.role !== 'ADMIN' && currentUser.uid !== id) {
            return res.status(403).send({
                success: false,
                message: 'Solo puedes actualizar tu propio perfil.'
            });
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        return res.send({
            success: true,
            message: 'Usuario actualizado exitosamente.',
            user: updatedUser
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message: 'Error general al actualizar el usuario.',
            error
        });
    }
};

/**
 * Eliminación de usuario.
 * - Un CLIENTE solo puede eliminar su propia cuenta (se valida la contraseña).
 * - Un ADMIN puede eliminar a otros usuarios, pero no a otro ADMIN (salvo que sea él mismo).
 */
export const deleteUser = async (req, res) => {
    const { id } = req.params;
    const { password } = req.body;

    try {
        const currentUser = req.user;
        const targetUser = await User.findById(id);

        if (!targetUser) {
            return res.status(404).send({
                success: false,
                message: 'Usuario no encontrado.'
            });
        }

        // Si el solicitante no es ADMIN, solo puede eliminar su propia cuenta.
        if (currentUser.role !== 'ADMIN' && currentUser.uid !== id) {
            return res.status(403).send({
                success: false,
                message: 'Solo puedes eliminar tu propia cuenta.'
            });
        }

        // Un ADMIN no puede eliminar a otro ADMIN (a menos que sea él mismo).
        if (currentUser.role === 'ADMIN' && targetUser.role === 'ADMIN' && currentUser.uid !== id) {
            return res.status(403).send({
                success: false,
                message: 'No puedes eliminar a otro ADMIN.'
            });
        }

        // Si el usuario se elimina a sí mismo, se valida la contraseña.
        if (currentUser.uid === id) {
            if (!password) {
                return res.status(400).send({
                    success: false,
                    message: 'La contraseña es obligatoria para eliminar tu cuenta.'
                });
            }
            const passwordMatches = await checkPassword(targetUser.password, password);
            if (!passwordMatches) {
                return res.status(400).send({
                    success: false,
                    message: 'Contraseña incorrecta; no se puede eliminar la cuenta.'
                });
            }
        }

        await User.findByIdAndDelete(id);

        return res.send({
            success: true,
            message: `La cuenta ${targetUser.username} ha sido eliminada exitosamente.`
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message: 'Error general al eliminar el usuario.',
            error
        });
    }
};

/**
 * Actualización de contraseña del usuario.
 * Solo se permite si el usuario autenticado es el mismo que el que se va a actualizar.
 */
export const updatePassword = async (req, res) => {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    try {
        if (id !== req.user.uid) {
            return res.status(403).send({
                success: false,
                message: 'No estás autorizado para actualizar esta contraseña.'
            });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'Usuario no encontrado.'
            });
        }

        const validCurrent = await checkPassword(user.password, currentPassword);
        if (!validCurrent) {
            return res.status(400).send({
                success: false,
                message: 'La contraseña actual es incorrecta.'
            });
        }

        if (currentPassword === newPassword) {
            return res.status(400).send({
                success: false,
                message: 'La nueva contraseña no puede ser igual a la actual.'
            });
        }

        user.password = await encrypt(newPassword);
        await user.save();

        return res.send({
            success: true,
            message: 'Contraseña actualizada exitosamente.'
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message: 'Error general al actualizar la contraseña.',
            error
        });
    }
};

/**
 * Obtención de todos los usuarios con paginación.
 */
export const getAllUsers = async (req, res) => {
    let { limit, skip } = req.query;
    limit = parseInt(limit) || 10;
    skip = parseInt(skip) || 0;

    try {
        const users = await User.find()
            .skip(skip)
            .limit(limit);

        if (users.length === 0) {
            return res.status(404).send({
                success: false,
                message: 'No se encontraron usuarios.'
            });
        }

        return res.send({
            success: true,
            message: 'Usuarios obtenidos exitosamente.',
            total: users.length,
            users
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message: 'Error general al obtener los usuarios.',
            error
        });
    }
};

/**
 * Obtención del historial de compras del usuario autenticado.
 * Se obtienen las facturas correspondientes y se hace populate de los campos relevantes.
 */
export const getPurchaseHistory = async (req, res) => {
    const userId = req.user.uid;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'Usuario no encontrado.'
            });
        }

        const invoices = await Invoice.find({ user: userId })
            .populate({
                path: 'user',
                select: 'username -_id'
            })
            .populate({
                path: 'items.product',
                select: 'name price -_id'
            });

        if (!invoices || invoices.length === 0) {
            return res.status(404).send({
                success: false,
                message: 'No se encontró historial de compras.'
            });
        }

        return res.send({
            success: true,
            message: 'Historial de compras obtenido exitosamente.',
            invoices
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message: 'Error al obtener el historial de compras.',
            error
        });
    }
};