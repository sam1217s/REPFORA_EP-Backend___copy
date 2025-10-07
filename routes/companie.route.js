import { Router } from "express";
import { companieCtrl } from "../controllers/companie.controller.js";
import { check } from "express-validator";
import { companieHelper } from "../helpers/companie.helper.js";
import { valideFields } from "../middlewares/validateField.middleware.js";
import webToken from "../middlewares/webToken.middleware.js";

const { listCompanies, saveCompanies, updateCompanies, activeCompanies, inactiveCompanies } = companieCtrl;

const routerCompanie = Router();

routerCompanie.get("/listCompanies", [
    webToken.validarJWT(["ETAPA PRODUCTIVA VIRTUAL", "ETAPA PRODUCTIVA PRESENCIAL"])
], listCompanies);

routerCompanie.post("/saveCompanies", [
    webToken.validarJWT(["ETAPA PRODUCTIVA VIRTUAL", "ETAPA PRODUCTIVA PRESENCIAL"]),
    check("company_nit").notEmpty().withMessage("El nit de la compañia es obligatorio").custom(companieHelper.validateExist),
    check("name").notEmpty().withMessage("El nombre de la compañia es obligatorio"),
    check("location").notEmpty().withMessage("La ubicacion de la compañia es obligatoria"),
    check("legal_representative_name").notEmpty().withMessage("El nombre del representante legal es obligatorio"),
    check("legal_representative_email").isEmail().withMessage("El email del representante legal es obligatorio"),
    check("legal_representative_phone").notEmpty().withMessage("El telefono del representante legal es obligatorio"),
    check("legal_representative_position").notEmpty().withMessage("El cargo del representante legal es obligatorio"),
    valideFields

], saveCompanies);

routerCompanie.put("/updateCompanies/:id", [
    webToken.validarJWT(["ETAPA PRODUCTIVA VIRTUAL", "ETAPA PRODUCTIVA PRESENCIAL"]),
    check("company_nit").notEmpty().withMessage("El nit de la compañia es obligatorio").custom(companieHelper.validateExist),
    check("name").notEmpty().withMessage("El nombre de la compañia es obligatorio"),
    check("location").notEmpty().withMessage("La ubicacion de la compañia es obligatoria"),
    check("legal_representative_name").notEmpty().withMessage("El nombre del representante legal es obligatorio"),
    check("legal_representative_email").isEmail().withMessage("El email del representante legal es obligatorio"),
    check("legal_representative_phone").notEmpty().withMessage("El telefono del representante legal es obligatorio"),
    check("legal_representative_position").notEmpty().withMessage("El cargo del representante legal es obligatorio"),
    valideFields
], updateCompanies);

routerCompanie.put("/activeCompanies/:id", [
    webToken.validarJWT(["ETAPA PRODUCTIVA VIRTUAL", "ETAPA PRODUCTIVA PRESENCIAL"])
], activeCompanies);

routerCompanie.put("/inactiveCompanies/:id", [
    webToken.validarJWT(["ETAPA PRODUCTIVA VIRTUAL", "ETAPA PRODUCTIVA PRESENCIAL"])
], inactiveCompanies);


export { routerCompanie }
