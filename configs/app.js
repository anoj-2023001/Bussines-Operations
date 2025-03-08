'use strict'

import express from 'express'         // Servidor HTTP
import morgan from 'morgan'           // Logs
import helmet from 'helmet'           // Seguridad para HTTP
import cors from 'cors'               // Acceso al API

// Importar rutas de cada módulo
import authRoutes from '../src/auth/auth.routes.js'
import userRoutes from '../src/user/user.routes.js'
import categoryRoutes from '../src/category/category.routes.js'
import invoiceRoutes from '../src/invoice/invoice.routes.js'
import productsRoutes from '../src/product/product.routes.js'
import cartRoutes from '../src/cart/cart.routes.js'
import clientRoutes from '../src/client/client.routes.js'
import profileRoutes from '../src/profile/profile.routes.js'

const configs = (app) => {
    app.use(express.json()) // Aceptar y enviar datos en JSON
    app.use(express.urlencoded({ extended: false })) // No encriptar la URL
    app.use(cors())
    app.use(helmet())
    app.use(morgan('dev'))
}

const routes = (app) => {
    // Registrar las rutas con un prefijo de versión para mayor organización
    app.use('/v1/auth', authRoutes)
    app.use('/v1/user', userRoutes)
    app.use('/v1/category', categoryRoutes)
    app.use('/v1/invoice', invoiceRoutes)
    app.use('/v1/product', productsRoutes)
    app.use('/v1/cart', cartRoutes)
    app.use('/v1/client', clientRoutes)
    app.use('/v1/profile', profileRoutes)
}
export const initServer = async()=>{
    const app = express() 
    try{
        configs(app) 
        routes(app)
        app.listen(process.env.PORT)
        console.log(`Server running in port ${process.env.PORT} 🚀🚀`)
    }catch(err){
        console.error('Server init failed', err)
    }
}
