import ep_parameter from "../models/parameter.model.js";
import { TYPES, CATEGORIES } from "../models/parameter.model.js";

const parameterCtrl = {};

parameterCtrl.listParameters = async (req, res) => {
    try {
        const parameters = await ep_parameter.find().sort({ createdAt: -1 });
        res.status(200).json(parameters);
    } catch (error) {
        res.status(500).json({ msg: "Error retrieving parameters" });
    }
}

parameterCtrl.filterParameters = async (req, res) => {
    try {
        const { name, type, category, status, page = 1, limit = 50 } = req.query;

        let filter = {};

        if (name) {
            filter.name = { $regex: name, $options: 'i' };
        }
        if (type) {
            filter.type = type.toUpperCase();
        }
        if (category) {
            filter.category = category.toUpperCase();
        }
        if (status !== undefined) {
            filter.status = Number(status);
        }

        if (type && !Object.values(TYPES).includes(type.toUpperCase())) {
            return res.status(400).json({
                msg: `Invalid type. Valid types: ${Object.values(TYPES).join(', ')}`
            });
        }

        if (category && !Object.values(CATEGORIES).includes(category.toUpperCase())) {
            return res.status(400).json({
                msg: `Invalid category. Valid categories: ${Object.values(CATEGORIES).join(', ')}`
            });
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const parameters = await ep_parameter.find(filter).sort({ category: 1, name: 1 }).skip(skip).limit(parseInt(limit));

        const total = await ep_parameter.countDocuments(filter);

        res.status(200).json({
            data: parameters,
            pagination: {
                current_page: parseInt(page),
                total_pages: Math.ceil(total / parseInt(limit)),
                total_records: total,
                records_per_page: parseInt(limit)
            },
            filters_applied: filter
        })

    } catch (error) {
        res.status(500).json({ msg: "Error filtering parameters" });
    }
}

parameterCtrl.createParameter = async (req, res) => {
    try {
        const { name, value, type, description, category } = req.body;

        const newParameter = new ep_parameter({ name, value, type, description, category });

        await newParameter.save();

        res.status(201).json({ msg: "Parameter created successfully", data: newParameter });

    } catch (error) {
        res.status(500).json({ msg: "Error creating parameter" });
    }
}

parameterCtrl.updateParameter = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, value, type, description, category } = req.body;

        const updatedParameter = await ep_parameter.findByIdAndUpdate(id, { name, value, type, description, category }, { new: true });

        if (!updatedParameter) {
            return res.status(404).json({ msg: "Parameter not found" });
        }
        res.status(200).json({ msg: "Parameter updated successfully", data: updatedParameter });

    } catch (error) {
        res.status(500).json({ msg: "Error updating parameter" });
    }
}

parameterCtrl.updateParameterStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const updatedParameter = await ep_parameter.findByIdAndUpdate(id, { status }, { new: true });

        if (!updatedParameter) {
            return res.status(404).json({ msg: "Parameter not found" });
        }
        res.status(200).json({ msg: "Parameter status updated successfully", data: updatedParameter });
    } catch (error) {
        res.status(500).json({ msg: "Error updating parameter status" });
    }
}

parameterCtrl.deleteParameter = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedParameter = await ep_parameter.findByIdAndDelete(id);

        if (!deletedParameter) {
            return res.status(404).json({ msg: "Parameter not found" });
        }
        res.status(200).json({ msg: "Parameter deleted successfully", data: deletedParameter });
    } catch (error) {
        res.status(500).json({ msg: "Error deleting parameter" });
    }
}

export { parameterCtrl };