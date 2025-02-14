import Category from '../category/category.model.js'

export const createCategory = async(req, res)=>{
    try {
        let data = req.body
        let category = new Category(data)
        await category.save()
        return res.send(
            {
                message: `Registered successfully, ${category.name}`
            }
        )
    } catch (err) {
        console.error(err);
        return res.status(500).send(
            {
                success: false,
                message: 'General error with create category',
                err
            }
        )
    }
}

export const updateCategory = async(req, res)=>{
    try{
        let id = req.params.id
        let data = req.body

        //Intentar actualizar
        let updatedCategory = await Category.findByIdAndUpdate( 
            id,
            data,
            {new: true} //Devuelve la última versión del documento
        )
        if(!updatedCategory) return res.status(404).send({message: 'User not updated'})
        return res.send(
            {
                success: true,
                message: 'User updated successfully', 
                updatedCategory
            }
        )
    }catch(err){
        console.error('General error', err)
        return res.status(500).send(
            {
                success: false,
                message: 'General error', 
                err
            }
        )
    }
}

export const getAll = async(req, res)=>{
    try{
        //Configuraciones de paginación
        const { limit = 20, skip = 0 } = req.query
        const users = await Category.find()
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

export const deleteCategory = async(req, res)=>{
    try{
        let id = req.params.id
        let deletedCategory = await Category.findByIdAndDelete({_id: id})
        if(!deletedCategory) return res.status(404).send({message: 'User not found, not deleted'})
        return res.send({message: 'Deleted user successfully', deletedCategory})
    }catch(err){
        console.error('General error', err)
        return res.status(500).send({message: 'General error', err})
    }
}