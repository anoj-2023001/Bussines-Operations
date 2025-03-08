// LÓGICA DE AUTENTICACIÓN
import User from '../user/user.model.js';
import { checkPassword, encrypt } from '../../utils/encrypt.js';
import { generateJwt } from '../../utils/jwt.js';

export const test = (req, res) => {
    console.log('test is running');
    return res.send({ message: 'Test is running' });
};

// Registro de usuario
export const register = async (req, res) => {
    try {
        // Capturar los datos del body
        const data = req.body;
        // Crear una nueva instancia de usuario
        const user = new User(data);
        // Encriptar la contraseña
        user.password = await encrypt(user.password);
        // Asignar rol por defecto
        user.role = 'CLIENT';
        // Guardar en la BD
        await user.save();
        // Responder al usuario
        return res.send({ message: `Registered successfully, you can login with email: ${user.email}` });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'General error with registering user', err });
    }
};

// Login de usuario
export const login = async (req, res) => {
    try {
        // Capturar datos del body
        const { email, password } = req.body;
        // Validar que ambos campos estén presentes
        if (!email || !password) {
            return res.status(400).send({ message: 'Email and password are required' });
        }
        // Buscar al usuario en la BD
        const user = await User.findOne({ email });
        // Verificar la contraseña
        if (user && await checkPassword(user.password, password)) {
            const loggedUser = {
                uid: user._id,
                email: user.email,
                role: user.role
            };
            // Generar el Token JWT
            const token = await generateJwt(loggedUser);
            return res.send({
                message: `Welcome ${user.username}`,
                loggedUser,
                token
            });
        }
        return res.status(400).send({ message: 'Wrong email or password' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'General error with login function' });
    }
};
