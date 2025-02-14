//Validaciones en relación a la BD

import User from '../src/user/user.model.js'
import { isValidObjectId } from 'mongoose'

export const existEmail = async(email)=>{
    const alreadyEmail = await User.findOne({email}) 
        if(alreadyEmail){
        console.error(`Email ${email} is already taken`)
        throw new Error(`Email ${email} is already taken`)
    }
}

export const objectIdValid = async(objectId)=>{    
    if(!isValidObjectId(objectId)){
        throw new Error(`Keeper is not objectId valid`)
    }
}

export const findUser = async(id)=>{
    try{
        const userExist = await User.findById(id)
        if(!userExist) return false
        return userExist
    }catch(err){
        console.error(err)
        return false
    }
}