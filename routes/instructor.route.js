import { Router } from "express";
import { instrCtrl } from "../controllers/instructor.controller.js";
import { instructorHelper } from "../helpers/instructor.helper.js";
import { check } from "express-validator";
import { valideFields } from "../middlewares/validateField.middleware.js";
import webToken from "../middlewares/webToken.middleware.js";


const { loginInstructor } = instrCtrl;

const routerInstructor = Router();
routerInstructor.post("/login", [
    check("document").notEmpty().withMessage("CAMPO DOCUMENTO VACIO"),
    check("password").notEmpty().withMessage("CAMPO CONTRASEÑA VACIO"),
    check("document").custom(instructorHelper.valideinstructor),
    valideFields
], loginInstructor);

export { routerInstructor };
