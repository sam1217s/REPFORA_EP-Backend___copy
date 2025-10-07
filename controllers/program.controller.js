import programModel from "../models/program.model.js";

const programCtrl = {};

programCtrl.listPrograms = async (req, res) => {
  try {
    const { status, program_level, admin_modality, code, version } = req.query;
    let filter = {};

    if (status !== undefined) {
      filter.status = Number(status);
    }
    if (program_level) {
      filter.program_level = program_level.toUpperCase();
    }
    if (admin_modality) {
      filter.admin_modality = admin_modality.toUpperCase();
    }
    if (code) {
      filter.code = { $regex: code, $options: "i" };
    }
    if (version) {
      filter.version = { $regex: version, $options: "i" };
    }

    const programs = await programModel.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ msg: programs });
  } catch (error) {
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

programCtrl.getProgramById = async (req, res) => {
  try {
    const { id } = req.params;
    const program = await programModel.findById(id);
    res.status(200).json({ msg: program });
  } catch (error) {
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

export { programCtrl };