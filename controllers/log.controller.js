import ep_log, { ACTIONS, MODULES, LEVELS } from '../models/log.model.js'

const logCtrl = {};

logCtrl.listLogs = async (req, res) => {
    try {
        const logs = await ep_log.find().sort({ createdAt: -1 });
        res.status(200).json(logs);
    } catch (error) {
        res.status(500).json({ msg: "Error listing logs" });
    }
}

logCtrl.filterLogs = async (req, res) => {
    try {
        const { action, module, level, affected_table, user, start_date, end_date, page = 1, limit = 50 } = req.query;

        let filter = {};

        // Filtros exactos
        if (action) {
            filter.action = action.toUpperCase();
        }

        if (module) {
            filter.module = module.toUpperCase();
        }

        if (level) {
            filter.level = level.toUpperCase();
        }

        if (affected_table) {
            filter.affected_table = affected_table.toUpperCase();
        }

        if (user) {
            filter.user = { $regex: user, $options: 'i' };
        }

        if (start_date || end_date) {
            filter.createdAt = {};
            if (start_date) {
                filter.createdAt.$gte = new Date(start_date);
            }
            if (end_date) {
                filter.createdAt.$lte = new Date(end_date);
            }
        }

        // Validar valores de enums
        if (action && !Object.values(ACTIONS).includes(action.toUpperCase())) {
            return res.status(400).json({
                msg: `Invalid action. Valid actions: ${Object.values(ACTIONS).join(', ')}`
            });
        }

        if (module && !Object.values(MODULES).includes(module.toUpperCase())) {
            return res.status(400).json({
                msg: `Invalid module. Valid modules: ${Object.values(MODULES).join(', ')}`
            });
        }

        if (level && !Object.values(LEVELS).includes(level.toUpperCase())) {
            return res.status(400).json({
                msg: `Invalid level. Valid levels: ${Object.values(LEVELS).join(', ')}`
            });
        }

        // Calculo de skip
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const logs = await ep_log.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)).populate('user_id', 'name email');

        const total = await ep_log.countDocuments(filter);

        res.status(200).json({
            data: logs,
            pagination: {
                current_page: parseInt(page),
                total_pages: Math.ceil(total / parseInt(limit)),
                total_records: total,
                records_per_page: parseInt(limit)
            },
            filters_applied: filter
        })

    } catch (error) {
        res.status(500).json({ msg: "Error filtering logs" });
    }
}

export { logCtrl };