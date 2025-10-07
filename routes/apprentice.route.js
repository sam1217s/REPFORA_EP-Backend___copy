import { Router } from "express";
import { apprenCtrl } from "../controllers/apprentice.controller.js";
import { valideFields } from "../middlewares/validateField.middleware.js"
import webToken from "../middlewares/webToken.middleware.js";
import { check } from 'express-validator';
import { apprenticeHelper } from "../helpers/apprentice.helper.js";

const { validateDocument, validateFiche, validateExsist, validateDocumentNumber, validateResetCode, validateEmailUniqueForUpdate, validateEmailExists, validateEmailNotExists } = apprenticeHelper

const { loadMassiveApprentice, saveApprentice, loginApprentice, disableApprentice, activateApprentice, listAprendice, updatePartApprentice, resetPassword, updatePassword, updateEntireApprentice, deleteApprentice } = apprenCtrl;

const routerApprentice = Router();

routerApprentice.post("/register", [
    webToken.validarJWT(["ETAPA PRODUCTIVA VIRTUAL", "ETAPA PRODUCTIVA PRESENCIAL", "INSTRUCTOR OWNER"]),
    check('documentNumber').notEmpty().withMessage("Numero de documento requerido").custom(validateDocument),
    check('documentType').notEmpty().withMessage("Tipo de documento requerido"),
    check('recordNumber').notEmpty().withMessage("Numero de ficha requerido").custom(validateFiche),
    check('firstName').notEmpty().withMessage("Primer nombre requerido"),
    check('lastName').notEmpty().withMessage("Segundo apellido requerido"),
    check('email').notEmpty().withMessage("Email requerido").custom(validateEmailExists),
    check('phone').notEmpty().withMessage("Numero de telefono requerido "),
    valideFields
], saveApprentice);

routerApprentice.post("/loadMassiveApprentice", [
    webToken.validarJWT(["ETAPA PRODUCTIVA VIRTUAL", "ETAPA PRODUCTIVA PRESENCIAL", "INSTRUCTOR OWNER"])
], loadMassiveApprentice)


routerApprentice.post("/login", [
    check('documentNumber').notEmpty().withMessage("Numero de documento requerido").custom(validateDocumentNumber),
    check('password').notEmpty().withMessage("Contraseña requerida"),
    valideFields
], loginApprentice)

routerApprentice.get("/listApprentice", [
    webToken.validarJWT(["ETAPA PRODUCTIVA VIRTUAL", "ETAPA PRODUCTIVA PRESENCIAL", "INSTRUCTOR OWNER"]),
    valideFields
], listAprendice)

routerApprentice.put("/activateApprentice/:id", [
    webToken.validarJWT(["ETAPA PRODUCTIVA VIRTUAL", "ETAPA PRODUCTIVA PRESENCIAL"]),
    check('id').notEmpty().withMessage("Id del aprendiz requerido").isMongoId().withMessage("Formato del id incorrecto").custom(validateExsist),
    valideFields
], activateApprentice)

routerApprentice.put("/disableApprentice/:id", [
    webToken.validarJWT(["ETAPA PRODUCTIVA VIRTUAL", "ETAPA PRODUCTIVA PRESENCIAL"]),
    check('id').notEmpty().withMessage("Id del aprendiz requerido").isMongoId().withMessage("Formato del id incorrecto").custom(validateExsist),
    valideFields
], disableApprentice)

routerApprentice.put("/updatePartApprentice/:id", [
    webToken.validarJWT(["APRENDIZ"]),
    check('id').notEmpty().withMessage("Id del aprendiz requerido").isMongoId().withMessage("Formato del id incorrecto").custom(validateExsist),
    check('phone').notEmpty().withMessage("Telefono requerido"),
    check('email').notEmpty().withMessage("Email requerido").custom(validateEmailUniqueForUpdate),
    valideFields
], updatePartApprentice)


routerApprentice.put("/updateEntireApprentice/:id", [
    webToken.validarJWT(["ETAPA PRODUCTIVA VIRTUAL", "ETAPA PRODUCTIVA PRESENCIAL"]),
    check('phone').notEmpty().withMessage("Telefono requerido"),
    check('email').notEmpty().withMessage("Email requerido").custom(validateEmailUniqueForUpdate),
    check('lastName').notEmpty().withMessage("Apellidos requeridos"),
    check('firstName').notEmpty().withMessage("Nombres requeridos"),
    check('documentNumber').notEmpty().withMessage("Numero de documento requerido"),
    check('documentType').notEmpty().withMessage("Tipo de documento requerido"),
    valideFields
], updateEntireApprentice)

routerApprentice.put("/resetPassword/:email", [
    webToken.validarJWT(["APRENDIZ", "ETAPA PRODUCTIVA VIRTUAL", "ETAPA PRODUCTIVA PRESENCIAL"]),
    check('email').notEmpty().withMessage("Email requerido").custom(validateEmailNotExists),
    valideFields
], resetPassword)


routerApprentice.put("/updatePassword/:email", [
    webToken.validarJWT(["APRENDIZ", "ETAPA PRODUCTIVA VIRTUAL", "ETAPA PRODUCTIVA PRESENCIAL"]),
    check('email').notEmpty().withMessage("Email requerido").custom(validateResetCode),
    valideFields
], updatePassword)


routerApprentice.delete("/deleteApprentice/:id", [
    webToken.validarJWT(["ETAPA PRODUCTIVA VIRTUAL", "ETAPA PRODUCTIVA PRESENCIAL"]),
    check("id").notEmpty().withMessage("id requerido").isMongoId().withMessage("Formato del id incorrecto").custom(validateExsist),
    valideFields,
], deleteApprentice)

export { routerApprentice };




