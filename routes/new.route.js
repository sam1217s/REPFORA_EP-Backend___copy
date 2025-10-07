import { Router } from "express";
import { newCtrl } from "../controllers/new.controller.js"
import webToken from "../middlewares/webToken.middleware.js";
const routerNew = Router()


const { listNew } = newCtrl;

routerNew.get("/listNews", [
    webToken.validarJWT(["ETAPA PRODUCTIVA VIRTUAL", "ETAPA PRODUCTIVA PRESENCIAL"])
], listNew)


export { routerNew }