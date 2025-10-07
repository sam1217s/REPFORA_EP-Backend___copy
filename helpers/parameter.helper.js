import ep_parameter from "../models/parameter.model.js";
import { TYPES, CATEGORIES } from "../models/parameter.model.js";

const parameterHelper = {}

parameterHelper.validateValueByType = (value, type) => {
    switch (type.toUpperCase()) {
        case 'STRING':
            if (typeof value !== 'string') {
                return { isValid: false, message: 'Value must be a string for STRING type' };
            }
            if (value.length === 0) {
                return { isValid: false, message: 'String value cannot be empty' };
            }
            break;

        case 'NUMBER':
            if (typeof value !== 'number' || isNaN(value)) {
                return { isValid: false, message: 'Value must be a valid number for NUMBER type' };
            }
            break;

        case 'BOOLEAN':
            if (typeof value !== 'boolean') {
                return { isValid: false, message: 'Value must be true or false for BOOLEAN type' };
            }
            break;

        case 'DATE':
            const date = new Date(value);
            if (isNaN(date.getTime())) {
                return { isValid: false, message: 'Value must be a valid date for DATE type' };
            }
            break;

        default:
            return { isValid: false, message: 'Invalid parameter type' };
    }

    return { isValid: true, message: 'Valid' };
};

parameterHelper.validateCreate = async (req, res, next) => {
    try {
        const { name, value, type, description, category } = req.body;

        if (!name || !value || !type || !description || !category) {
            return res.status(400).json({ msg: "All fields are required" });
        }

        if (!Object.values(TYPES).includes(type.toUpperCase())) {
            return res.status(400).json({
                msg: `Invalid type. Valid types: ${Object.values(TYPES).join(', ')}`
            });
        }

        if (!Object.values(CATEGORIES).includes(category.toUpperCase())) {
            return res.status(400).json({
                msg: `Invalid category. Valid categories: ${Object.values(CATEGORIES).join(', ')}`
            });
        }

        const existingParameter = await ep_parameter.findOne({
            name: name.toUpperCase()
        });

        if (existingParameter) {
            return res.status(400).json({
                msg: `Parameter with name '${name}' already exists`
            });
        }

        const valueValidation = parameterHelper.validateValueByType(value, type);
        if (!valueValidation.isValid) {
            return res.status(400).json({
                msg: valueValidation.message
            });
        }

        if (name.length < 3 || name.length > 50) {
            return res.status(400).json({
                msg: "Parameter name must be between 3 and 50 characters"
            });
        }

        if (description.length < 10 || description.length > 200) {
            return res.status(400).json({
                msg: "Description must be between 10 and 200 characters"
            });
        }

        next();
    } catch (error) {
        res.status(500).json({ msg: "Error validating parameter creation" });
    }
}

parameterHelper.validateUpdate = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, value, type, description, category } = req.body;

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                msg: "Invalid parameter ID format"
            });
        }

        const existingParameter = await ep_parameter.findById(id);
        if (!existingParameter) {
            return res.status(404).json({
                msg: "Parameter not found"
            });
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

        if (name && name.toUpperCase() !== existingParameter.name) {
            const duplicateParameter = await ep_parameter.findOne({
                name: name.toUpperCase(),
                _id: { $ne: id }
            });

            if (duplicateParameter) {
                return res.status(400).json({
                    msg: `Parameter with name '${name}' already exists`
                });
            }
        }

        if (value !== undefined && type) {
            const valueValidation = parameterHelper.validateValueByType(value, type);
            if (!valueValidation.isValid) {
                return res.status(400).json({
                    msg: valueValidation.message
                });
            }
        }

        if (name && (name.length < 3 || name.length > 50)) {
            return res.status(400).json({
                msg: "Parameter name must be between 3 and 50 characters"
            });
        }

        if (description && (description.length < 10 || description.length > 200)) {
            return res.status(400).json({
                msg: "Description must be between 10 and 200 characters"
            });
        }

        next();
    } catch (error) {
        res.status(500).json({ msg: "Error validating parameter update data" });
    }
};

parameterHelper.validateStatusUpdate = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                msg: "Invalid parameter ID format"
            });
        }

        const existingParameter = await ep_parameter.findById(id);
        if (!existingParameter) {
            return res.status(404).json({
                msg: "Parameter not found"
            });
        }

        if (status === undefined || !Number.isInteger(Number(status))) {
            return res.status(400).json({
                msg: "Status must be a valid integer (0=inactive, 1=active, 2=deprecated)"
            });
        }

        const statusNumber = Number(status);
        if (statusNumber < 0 || statusNumber > 2) {
            return res.status(400).json({
                msg: "Status must be 0 (inactive), 1 (active), or 2 (deprecated)"
            });
        }

        next();
    } catch (error) {
        res.status(500).json({ msg: "Error validating status update" });
    }
};

parameterHelper.validateDelete = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                msg: "Invalid parameter ID format"
            });
        }

        const existingParameter = await ep_parameter.findById(id);
        if (!existingParameter) {
            return res.status(404).json({
                msg: "Parameter not found"
            });
        }

        const CRITICAL_PARAMETERS = [
            'EMAIL_FROM_ADDRESS',
            'SESSION_TIMEOUT_MINUTES',
            'MAX_FILE_SIZE_MB'
        ];

        if (CRITICAL_PARAMETERS.includes(existingParameter.name)) {
            return res.status(400).json({
                msg: `Cannot delete critical system parameter: ${existingParameter.name}`
            });
        }

        if (existingParameter.status === 1) {
            return res.status(400).json({
                msg: "Cannot delete active parameter. Please deactivate it first."
            });
        }

        next();
    } catch (error) {
        res.status(500).json({ msg: "Error validating parameter deletion" });
    }
};

export { parameterHelper };