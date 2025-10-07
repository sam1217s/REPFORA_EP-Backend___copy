import { Router } from "express";
import { registrationCtrl } from "../controllers/registration.controller.js";
import { registrationHelper } from "../helpers/registration.helper.js";
import { check } from "express-validator";
import { valideFields } from "../middlewares/validateField.middleware.js";
import webToken from "../middlewares/webToken.middleware.js";

// Importar validaciones del helper
const {
  validateRegistrationNumber,
  validateModality,
  validateCompany,
  validateExist,
  validateActiveRegistration,
} = registrationHelper;

// Importar funciones del controlador
const {
  listRegistrations,
  saveRegistration,
  updateRegistration,
  validateRegistration,
  deleteRegistration,
} = registrationCtrl;

const routerRegistration = Router();

// LISTAR REGISTROS
// Ruta para obtener todos los registros con filtros opcionales
// Solo accesible para coordinadores de EP
routerRegistration.get(
  "/listRegistrations",
  [
    webToken.validarJWT([
      "ETAPA PRODUCTIVA VIRTUAL",
      "ETAPA PRODUCTIVA PRESENCIAL",
    ]),
  ],
  listRegistrations
);

// CREAR REGISTRO
// Ruta para crear un nuevo registro de etapa productiva
// Solo accesible para APRENDICES
routerRegistration.post(
  "/saveRegistration",
  [
    webToken.validarJWT(["APRENDIZ"]),
    // Validar número de registro
    check("registration_number")
      .notEmpty()
      .withMessage("Número de registro requerido")
      .custom(validateRegistrationNumber),
    // Validar que el aprendiz no tenga registro activo
    check("registration_number")
      .custom(validateActiveRegistration),
    // Validar modalidad
    check("modality_id")
      .notEmpty()
      .withMessage("ID de la modalidad requerido")
      .isMongoId()
      .withMessage("Formato del ID de la modalidad incorrecto")
      .custom(validateModality),
    // Validar empresa (opcional)
    check("company_id")
      .optional()
      .isMongoId()
      .withMessage("Formato del ID de la empresa incorrecto")
      .custom(validateCompany),
    // Validar fecha de inicio
    check("scheduled_start_date")
      .notEmpty()
      .withMessage("Fecha de inicio requerida")
      .isDate()
      .withMessage("Formato de fecha incorrecto"),
    // Validar horas totales
    check("total_requested_hours")
      .notEmpty()
      .withMessage("Total de horas requerido")
      .isNumeric()
      .withMessage("Total de horas debe ser numérico"),
    // Validar días laborales
    check("working_days")
      .optional()
      .isNumeric()
      .withMessage("Días laborales debe ser numérico"),
    // Validar horas diarias
    check("daily_hours")
      .optional()
      .isNumeric()
      .withMessage("Horas diarias debe ser numérico"),
    valideFields,
  ],
  saveRegistration
);

// ACTUALIZAR REGISTRO
// Ruta para actualizar datos del registro
// Solo accesible para APRENDICES
routerRegistration.put(
  "/updateRegistration/:id",
  [
    webToken.validarJWT(["APRENDIZ"]),
    // Validar ID del registro
    check("id")
      .notEmpty()
      .withMessage("ID del registro requerido")
      .isMongoId()
      .withMessage("Formato del ID incorrecto")
      .custom(validateExist),
    // Validaciones opcionales de campos
    check("scheduled_start_date")
      .optional()
      .isDate()
      .withMessage("Formato de fecha incorrecto"),
    check("total_requested_hours")
      .optional()
      .isNumeric()
      .withMessage("Total de horas debe ser numérico"),
    check("working_days")
      .optional()
      .isNumeric()
      .withMessage("Días laborales debe ser numérico"),
    check("daily_hours")
      .optional()
      .isNumeric()
      .withMessage("Horas diarias debe ser numérico"),
    valideFields,
  ],
  updateRegistration
);

// VALIDAR REGISTRO (APROBAR/RECHAZAR)
// Ruta para que el coordinador apruebe o rechace el registro
// Solo accesible para coordinadores de EP
routerRegistration.put(
  "/validateRegistration/:id",
  [
    webToken.validarJWT([
      "ETAPA PRODUCTIVA VIRTUAL",
      "ETAPA PRODUCTIVA PRESENCIAL",
    ]),
    // Validar ID del registro
    check("id")
      .notEmpty()
      .withMessage("ID del registro requerido")
      .isMongoId()
      .withMessage("Formato del ID incorrecto")
      .custom(validateExist),
    // Validar estado del registro (0=APROBADO, 1=RECHAZADO)
    check("registration_status")
      .notEmpty()
      .withMessage("Estado del registro requerido")
      .isNumeric()
      .withMessage("El estado debe ser numérico")
      .isIn([0, 1])
      .withMessage("Estado inválido. Debe ser 0 (APROBADO) o 1 (RECHAZADO)"),
    valideFields,
  ],
  validateRegistration
);

// ELIMINAR REGISTRO
// Ruta para eliminar permanentemente un registro
// Solo accesible para coordinadores de EP
routerRegistration.delete(
  "/deleteRegistration/:id",
  [
    webToken.validarJWT([
      "ETAPA PRODUCTIVA VIRTUAL",
      "ETAPA PRODUCTIVA PRESENCIAL",
    ]),
    check("id")
      .notEmpty()
      .withMessage("ID del registro requerido")
      .isMongoId()
      .withMessage("Formato del ID incorrecto")
      .custom(validateExist),
    valideFields,
  ],
  deleteRegistration
);

export { routerRegistration };