import programModel from "../models/program.model.js";

const programHelper = {};

programHelper.validateExistById = async (parameter) => {
  const searchProgram = await programModel.findById(parameter);
  if (!searchProgram) {
    throw new Error(`El programa con ID ${parameter} no existe`);
  }
  return true;
};

export { programHelper };