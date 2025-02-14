import { Router } from 'express'
import {
    createCategory,
    deleteCategory,
    getAll,
    updateCategory
} from './category.controller.js'
import { validateJwt } from '../../middlewares/validate.jwt.js'

const api = Router()


//Rutas privadas
api.post(
    '/CreateCategory',
    [
        validateJwt,
        createCategory
    ]
)

api.put(
    '/update/:id',
    [
        validateJwt,
        updateCategory
    ]
)

api.get(
    '/getCategory',
    [ 
        validateJwt,
        getAll
    ]

)

api.delete(
    '/delCategory/:id',
    [
        validateJwt,
        deleteCategory
    ]
)

export default api