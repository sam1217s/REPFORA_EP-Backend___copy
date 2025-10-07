import { Router } from "express";
import { logCtrl } from "../controllers/log.controller.js";
import webToken from "../middlewares/webToken.middleware.js";
const routerLog = Router();
const { listLogs, filterLogs } = logCtrl;

routerLog.get("/listLogs", [
    webToken.validarJWT(["ETAPA PRODUCTIVA VIRTUAL", "ETAPA PRODUCTIVA PRESENCIAL"])
], listLogs);

routerLog.get("/filterLogs", [
    webToken.validarJWT(["ETAPA PRODUCTIVA VIRTUAL", "ETAPA PRODUCTIVA PRESENCIAL"])
], filterLogs);

export { routerLog };