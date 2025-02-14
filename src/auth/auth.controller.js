//LÓGICA DE AUTENTICACIÓN
import User from '../user/user.model.js'
import { checkPassword, encrypt } from '../../utils/encrypt.js'
import { generateJwt } from '../../utils/jwt.js'

export const test = (req, res)=>{
    console.log('test is running')
    return res.send({message: 'Test is running'})
}

//Register
export const register = async(req, res)=>{
    try{
        //Capturar los datos
        let data = req.body
        //Aquí van validaciones
        let user = new User(data)

        //Encriptar la password
        user.password = await encrypt(user.password)
        //Asignar rol por defecto
        user.role = 'CLIENT'
        //Guardar
        await user.save()
        //Responder al usuario
        return res.send({message: `Registered successfully, can be logged with username: ${user.email}`})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'General error with registering user', err})
    }
}
//Login
export const login = async(req, res) => {
    try {
        // Capturar los datos (body)
        let { email, password } = req.body;

        // Validar que los campos no estén vacíos
        if (!email || !password) {
            return res.status(400).send({ message: 'Email and password are required' });
        }

        // Validar que el usuario exista
        let user = await User.findOne({ email: email });

        // Verificar que la contraseña coincida
        if(user && await checkPassword(user.password, password)) {
            let loggedUser = { // No puede ir data sensible
                uid: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
            // Generar el Token
            let token = await generateJwt(loggedUser);
            // Responder al usuario
            return res.send({
                message: `Welcome ${user.name}`,
                loggedUser,
                token
            });
        }
        return res.status(400).send({message: 'Wrong email or password'});
    } catch(err) {
        console.error(err);
        return res.status(500).send({message: 'General error with login function'});
    }
}