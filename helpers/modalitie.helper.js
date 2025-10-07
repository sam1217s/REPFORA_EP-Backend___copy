import modalitieModels from "../models/modalitie.model.js"

const modalitieHelper = {}


modalitieHelper.validateExist = async (parameter, {req}) => {
    const id = req.params.id
    const searchModality = await modalitieModels.findOne({ name: { $regex: `^${parameter}$`, $options: 'i' } })

    if(searchModality && searchModality._id != id){
        throw new Error(`La modalidad ${parameter} ya esta registrada`)
    }
}

export{ modalitieHelper }