// profile.controller.js
import User from '../user/user.model.js';

export const getProfile = async (req, res) => {
    try {
        const userId = req.user.uid;
        // Excluir la contraseña y otros campos que no quieras mostrar
        const user = await User.findById(userId).select('-password -__v');
        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'User not found.'
            });
        }
        return res.send({
            success: true,
            user
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message: 'Error retrieving profile.',
            error
        });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const userId = req.user.uid;
        // Evitar actualizar el rol o la contraseña aquí
        const { role, password, ...updateData } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, select: '-password -__v' }
        );
        if (!updatedUser) {
            return res.status(404).send({
                success: false,
                message: 'User not found.'
            });
        }
        return res.send({
            success: true,
            message: 'Profile updated successfully.',
            user: updatedUser
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message: 'Error updating profile.',
            error
        });
    }
};
