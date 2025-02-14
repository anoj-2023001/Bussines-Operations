import User from "./user.model.js"

export const getAll = async(req, res)=>{
    try{
        //Configuraciones de paginación
        const { limit = 20, skip = 0 } = req.query
        const users = await User.find()
            .skip(skip)
            .limit(limit)

        if(users.length === 0) return res.status(404).send({message: 'Users not found', success: false})
        return res.send(
            {
                success: true,
                message: 'Users found: ', 
                users,
                total: users.length
            }
        )
    }catch(err){
        console.error(err)
        return res.status(500).send(
            {
                success: false,
                message: 'General error', 
                err
            }
        )
    }
}

//Obtener 1 usuario por su ID
export const get = async(req, res)=>{
    try{
        const { id } = req.params
        const user = await User.findById(id)

        if(!user) return res.status(404).send(
            {
                sucess: false,
                message: 'User not found'
            }
        )
        return res.send(
            {
                success: true,
                message: 'User found',
                user
            }
        )
    }catch(err){
        console.error(err)
        return res.status(500).send(
            {
                success: false,
                message: 'General error', 
                err
            }
        )
    }
}

//update
export const updateUser = async(req, res)=>{
    try{
        let id = req.params.id
        let data = req.body

        //Intentar actualizar
        let updatedUser = await User.findByIdAndUpdate( 
            id,
            data,
            {new: true} //Devuelve la última versión del documento
        )
        if(!updatedUser) return res.status(404).send({message: 'User not updated'})
        return res.send({message: 'User updated successfully', updatedUser})
    }catch(err){
        console.error('General error', err)
        return res.status(500).send({message: 'General error', err})
    }
}

//delete
export const deleteUser = async(req, res)=>{
    try{
        let id = req.params.id
        let deletedUser = await User.findByIdAndDelete({_id: id})
        if(!deletedUser) return res.status(404).send({message: 'User not found, not deleted'})
        return res.send({message: 'Deleted user successfully', deletedUser})
    }catch(err){
        console.error('General error', err)
        return res.status(500).send({message: 'General error', err})
    }
}
