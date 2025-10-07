import { Router } from "express";
import { ficheCtrl } from "../controllers/fiche.controller.js";
import webToken from "../middlewares/webToken.middleware.js";


const {getFicheId,} = ficheCtrl;

const routerFiche = Router();
routerFiche.get("/listFiche",[ 
    webToken.validarJWT(["ETAPA PRODUCTIVA VIRTUAL", "ETAPA PRODUCTIVA PRESENCIAL"])
], getFicheId);

export { routerFiche };