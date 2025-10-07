import registrationModels from "../models/registration.model.js";
import apprenticeModels from "../models/apprentice.model.js";
import modalitieModels from "../models/modalitie.model.js";
import companieModels from "../models/companie.model.js";

const registrationHelper = {};

// VALIDAR SI EL NUMERO DE REGISTRO YA EXISTE
// Valida que no exista otro registro con el mismo número
registrationHelper.validateRegistrationNumber = async (parameter, { req }) => {
  const id = req.params.id;
  const searchRegistration = await registrationModels.findOne({
    registration_number: { $regex: `^${parameter}$`, $options: "i" },
  });

  // Si existe y no es el mismo que estamos editando, lanzar error
  if (searchRegistration && searchRegistration._id != id) {
    throw new Error(
      `El número de registro ${parameter} ya está registrado`
    );
  }
};

// VALIDAR SI EXISTE LA MODALIDAD
// Verifica que la modalidad exista en la base de datos y esté activa
registrationHelper.validateModality = async (parameter) => {
  const searchModality = await modalitieModels.findById(parameter);
  if (!searchModality) {
    throw new Error(`La modalidad con ID ${parameter} no está registrada`);
  }
  if (searchModality.status === 1) {
    throw new Error(`La modalidad está inactiva`);
  }
  return true;
};

// VALIDAR SI EXISTE LA EMPRESA (OPCIONAL)
// Verifica que la empresa exista si se proporciona (algunas modalidades no requieren empresa)
registrationHelper.validateCompany = async (parameter) => {
  if (!parameter) {
    return true;
  }
  const searchCompany = await companieModels.findById(parameter);
  if (!searchCompany) {
    throw new Error(`La empresa con ID ${parameter} no está registrada`);
  }
  if (searchCompany.status === 1) {
    throw new Error(`La empresa está inactiva`);
  }
  return true;
};

// VALIDAR SI EXISTE EL REGISTRO
// Verifica que el registro exista en la base de datos
registrationHelper.validateExist = async (parameter) => {
  const searchRegistration = await registrationModels.findById(parameter);
  if (!searchRegistration) {
    throw new Error(`El registro con ID ${parameter} no existe`);
  }
  return true;
};

// VALIDAR QUE EL APRENDIZ NO TENGA UN REGISTRO ACTIVO
// Evita que un aprendiz tenga múltiples registros pendientes o aprobados simultáneamente
registrationHelper.validateActiveRegistration = async (parameter, { req }) => {
  const apprentice = req.apprentice;
  const searchRegistration = await registrationModels.findOne({
    apprentice_id: apprentice._id,
    registration_status: { $in: [3, 0] }, // 3=PENDIENTE, 0=APROBADO
  });

  if (searchRegistration) {
    throw new Error(`Ya tienes un registro activo`);
  }
  return true;
};

export { registrationHelper };