import companiesModels from "../models/companie.model.js";


const companieCtrl = {}


companieCtrl.listCompanies = async (req, res) => {
    try {
        const companies = await companiesModels.find({}).sort({createdAt: 1})
        res.status(200).json({ msg: companies })
    } catch (error) {
        res.status(500).json({ msg: "Error en el servidor" })
    }
}


companieCtrl.saveCompanies = async (req, res) => {
    
    try {
        const { company_nit,
            name,
            location,
            legal_representative_name,
            legal_representative_email,
            legal_representative_phone,
            legal_representative_position } = req.body
        const company = new companiesModels({
            company_nit,
            name: name.toUpperCase(),
            location: location.toUpperCase(),
            legal_representative_phone,
            legal_representative_name: legal_representative_name.toUpperCase(),
            legal_representative_email: legal_representative_email.toLowerCase(),
            legal_representative_position: legal_representative_position.toUpperCase()
        })

        await company.save()

        res.status(200).json({ msg: "Compañia creada correctamente" })
    }

    catch (error) {
        res.status(500).json({ msg: "Error en el servidor", })
    }

}

companieCtrl.updateCompanies = async (req, res) => {
    try {
        const { id } = req.params
        const { company_nit, name, location, legal_representative_name, legal_representative_email, legal_representative_phone, legal_representative_position } = req.body

        await companiesModels.findByIdAndUpdate({ _id: id }, {
            company_nit,
            name: name.toUpperCase(),
            location: location.toUpperCase(),
            legal_representative_phone,
            legal_representative_name: legal_representative_name.toUpperCase(),
            legal_representative_email: legal_representative_email.toLowerCase(),
            legal_representative_position: legal_representative_position.toUpperCase()
        })
        res.status(200).json({ msg: "Compañia actualizada" })
    } catch (error) {
        res.status(500).json({ msg: "Error en el servidor" })
    }
}

companieCtrl.activeCompanies = async (req, res) => {
    try {
        const { id } = req.params
        await companiesModels.findByIdAndUpdate({ _id: id }, {
            status: 0
        })
        res.status(200).json({ msg: "Empresa activada correctamente" })
    } catch (error) {
        res.status(500).json({ msg: "Error en el servidor" })
    }
}
companieCtrl.inactiveCompanies = async (req, res) => {
    try {
        const { id } = req.params
        await companiesModels.findByIdAndUpdate({ _id: id }, {
            status: 1
        })
        res.status(200).json({ msg: "Empresa desactivada correctamente" })
    } catch (error) {
        res.status(500).json({ msg: "Error en el servidor" })
    }
}

export {
    companieCtrl
}
