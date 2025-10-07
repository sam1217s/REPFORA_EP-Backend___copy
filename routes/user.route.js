import { Router } from "express";
import { userCtrl } from "../controllers/user.controller.js";
import { valideFields } from "../middlewares/validateField.middleware.js";
import webToken from "../middlewares/webToken.middleware.js";
import { userHelper } from "../helpers/user.helper.js";
import { check } from "express-validator";



const { loginUser, } = userCtrl;

const routerUser = Router();
routerUser.post("/login", [
    check("role").notEmpty().withMessage("Campo rol obligatorio"),
    check("email").notEmpty().withMessage("Campo email obligatorio"),
    check("email").isEmail().withMessage(" Formato de email incorrecto"),
    check("password").notEmpty().withMessage(" Campo contraseña obligatorio"),
    check("email").custom(userHelper.validateUser),
    valideFields
], loginUser);


export { routerUser };
