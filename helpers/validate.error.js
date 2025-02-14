import { validationResult } from "express-validator" 

//Cuando no hay imágenes
export const validateErrorWithoutImg = (req, res, next)=>{
    const errors = validationResult(req)
   
    if (!errors.isEmpty()){
        return res.status(400).send(
            {
                success: false,
                message: 'Validation errors',
                errors: errors.errors
            }
        )
    }
    next()
}