//Rutas de funciones de usuario
import { Router } from 'express'
import { 
    deleteUser,
    get, 
    getAll, 
    updateUser
} from './user.controller.js'
import { validateJwt } from '../../middlewares/validate.jwt.js'

const api = Router()

//Rutas privadas
api.get(
    '/getAll', 
    [
        validateJwt
    ], 
    getAll
)
api.get(
    '/:id', 
    [
        validateJwt
    ], 
    get
)

api.put(
    '/update/:id',
    [
        validateJwt
    ],
    updateUser
)

api.delete(
    '/delete/:id',
    [
        validateJwt
    ],
    deleteUser
)

export default api