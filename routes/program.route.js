import { Router } from "express";
import { programCtrl } from "../controllers/program.controller.js";
import { programHelper } from "../helpers/program.helper.js";
import { check } from "express-validator";
import { valideFields } from "../middlewares/validateField.middleware.js";
import webToken from "../middlewares/webToken.middleware.js";

const { validateExistById } = programHelper;

const { listPrograms, getProgramById } = programCtrl;

const routerProgram = Router();

routerProgram.get(
  "/listPrograms",
  [
    webToken.validarJWT([
      "ETAPA PRODUCTIVA VIRTUAL",
      "ETAPA PRODUCTIVA PRESENCIAL",
    ]),
  ],
  listPrograms
);

routerProgram.get(
  "/getProgramById/:id",
  [
    webToken.validarJWT([
      "ETAPA PRODUCTIVA VIRTUAL",
      "ETAPA PRODUCTIVA PRESENCIAL",
    ]),
    check("id")
      .notEmpty()
      .withMessage("Campo id obligatorio")
      .isMongoId()
      .withMessage("Formato de id incorrecto")
      .custom(validateExistById),
    valideFields,
  ],
  getProgramById
);

export { routerProgram };