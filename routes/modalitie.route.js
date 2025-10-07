import { Router } from "express";
import { modalitieCtrl } from "../controllers/modalitie.controller.js";
import { check } from "express-validator";
import { valideFields } from "../middlewares/validateField.middleware.js";
import webToken from "../middlewares/webToken.middleware.js";
import { modalitieHelper } from "../helpers/modalitie.helper.js";
const routerModalities = Router();

const { listModalities, saveModalities, updateModalities, activeModalities, inactiveModalities, deteleModalities } = modalitieCtrl;
const { validateExist } = modalitieHelper

routerModalities.get("/listModalities", [
    webToken.validarJWT(["ETAPA PRODUCTIVA VIRTUAL", "ETAPA PRODUCTIVA PRESENCIAL", "APRENDIZ"])
], listModalities)

routerModalities.post("/saveModalities", [
    webToken.validarJWT(["ETAPA PRODUCTIVA VIRTUAL", "ETAPA PRODUCTIVA PRESENCIAL"]),
    check("name").notEmpty().withMessage("Campo nombre obligatorio").custom(validateExist),
    check("description").notEmpty().withMessage("Campo descripcion obligatorio"),
    check("standard_hours").notEmpty().withMessage("Campo horas estandar obligatorio"),
    check("requires_follow_up_instructor").notEmpty().withMessage("Campo requiere instructor de seguimiento obligatorio"),
    check("requires_technical_instructor").notEmpty().withMessage("Campo requiere instructor tecnico obligatorio"),
    check("requires_project_instructor").notEmpty().withMessage("Campo requiere instructor de proyecto obligatorio"),
    valideFields
], saveModalities)

routerModalities.put("/updateModalities/:id", [
    webToken.validarJWT(["ETAPA PRODUCTIVA VIRTUAL", "ETAPA PRODUCTIVA PRESENCIAL"]),
    check("id").notEmpty().withMessage("Campo id obligatorio").isMongoId().withMessage("Formato de id incorrecto"),
    check("name").notEmpty().withMessage("Campo nombre obligatorio").custom(validateExist),
    check("description").notEmpty().withMessage("Campo descripcion obligatorio"),
    check("standard_hours").notEmpty().withMessage("Campo horas estandar obligatorio"),
    check("requires_follow_up_instructor").notEmpty().withMessage("Campo requiere instructor de seguimiento obligatorio"),
    check("requires_technical_instructor").notEmpty().withMessage("Campo requiere instructor tecnico obligatorio"),
    check("requires_project_instructor").notEmpty().withMessage("Campo requiere instructor de proyecto obligatorio"),
    valideFields
], updateModalities)

routerModalities.put("/activeModalities/:id", [
    webToken.validarJWT(["ETAPA PRODUCTIVA VIRTUAL", "ETAPA PRODUCTIVA PRESENCIAL"]),
    check("id").notEmpty().withMessage("Campo id obligatorio").isMongoId().withMessage("Formato de id incorrecto"),
    valideFields
], activeModalities)

routerModalities.put("/inactiveModalities/:id", [
    webToken.validarJWT(["ETAPA PRODUCTIVA VIRTUAL", "ETAPA PRODUCTIVA PRESENCIAL"]),
    check("id").notEmpty().withMessage("Campo id obligatorio").isMongoId().withMessage("Formato de id incorrecto"),
    valideFields
], inactiveModalities)

routerModalities.delete("/deleteModalities/:id", [
    webToken.validarJWT(["ETAPA PRODUCTIVA VIRTUAL", "ETAPA PRODUCTIVA PRESENCIAL"]),
    check("id").notEmpty().withMessage("Campo id obligatorio").isMongoId().withMessage("Formato de id incorrecto"),
    valideFields
], deteleModalities)


export { routerModalities };