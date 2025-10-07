import companiesModels from "../models/companie.model.js"

const companieHelper = {}


companieHelper.validateExist = async (parameter, {req}) => {
    const id = req.params.id
    const searchCompanie = await companiesModels.findOne({ company_nit: { $regex: `^${parameter}$`, $options: 'i' } })

    if(searchCompanie && searchCompanie._id != id){
        throw new Error(`La empresa con NIT ${parameter} ya esta registrada`)
    }
}


export{
    companieHelper
}