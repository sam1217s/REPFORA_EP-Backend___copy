import modalityModels from "../models/modalitie.model.js";

const modalitieCtrl = {};

modalitieCtrl.listModalities = async (req, res) => {
    const { name, requires_follow_up_instructor, requires_technical_instructor, requires_project_instructor } = req.query
    try {
        let filter = {}

        if (name) {
            filter.name = name.toUpperCase()
        }
        if (requires_follow_up_instructor) {
            filter.requires_follow_up_instructor = requires_follow_up_instructor
        }
        if(requires_technical_instructor){
            filter.requires_technical_instructor = requires_technical_instructor
        }
        if(requires_project_instructor){
            filter.requires_project_instructor = requires_project_instructor
        }

        const modalities = await modalityModels.find(filter).sort({createdAt: -1});
        res.status(200).json({ msg: modalities })

    } catch (error) {
        res.status(500).json({ msg: "Error en el servidor" })
    }
}

modalitieCtrl.saveModalities = async (req, res) => {
    try {
        const {
            name,
            description,
            standard_hours,
            requires_follow_up_instructor,
            requires_technical_instructor,
            requires_project_instructor } = req.body

        const modality = new modalityModels({
            name: name.toUpperCase(),
            description: description.toUpperCase(),
            standard_hours,
            requires_follow_up_instructor,
            requires_project_instructor,
            requires_technical_instructor
        })
        await modality.save()
        res.status(200).json({ msg: "Modalidad creada correctamente" })
    }
    catch (error) {
        res.status(500).json({ msg: "Error en el servidor" })
    }
}

modalitieCtrl.updateModalities = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name,
            description,
            standard_hours,
            requires_follow_up_instructor,
            requires_technical_instructor,
            requires_project_instructor } = req.body

        await modalityModels.findByIdAndUpdate({ _id: id }, {
            name: name.toUpperCase(),
            description: description.toUpperCase(),
            standard_hours,
            requires_follow_up_instructor,
            requires_technical_instructor,
            requires_project_instructor
        })

        res.status(200).json({ msg: "Modalidad actualizada correctamente" })
    } catch (error) {
        res.status(500).json({ msg: "Error en el servidor" })
    }
}

modalitieCtrl.activeModalities = async (req, res) => {
    try {
        const { id } = req.params
        await modalityModels.findByIdAndUpdate({ _id: id }, {
            status: 0
        })
        res.status(200).json({ msg: "Modalidad activada correctamente" })
    } catch (error) {
        res.status(500).json({ msg: "Error en el servidor" })
    }
}

modalitieCtrl.inactiveModalities = async (req, res) => {
    try {
        const { id } = req.params
        await modalityModels.findByIdAndUpdate({ _id: id }, {
            status: 1
        })

        res.status(200).json({ msg: "Modalidad desactivada correctamente" })
    } catch (error) {
        res.status(500).json({ msg: "Error en el servidor" })
    }
}

modalitieCtrl.deteleModalities = async (req, res) => {
    try {
        const { id } = req.params
        await modalityModels.findByIdAndDelete({ _id: id })
        res.status(200).json({ msg: "Modalidad eliminada correctamente" })
    } catch (error) {
        res.status(500).json({ msg: "Error en el servidor" })
    }
}


export { modalitieCtrl }
