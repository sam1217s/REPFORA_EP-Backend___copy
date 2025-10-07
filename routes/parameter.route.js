import { Router } from "express";
import { parameterCtrl } from "../controllers/parameter.controller.js";
import { parameterHelper } from "../helpers/parameter.helper.js";
import { valideFields } from "../middlewares/validateField.middleware.js";

const routerParameter = Router();

const { listParameters, filterParameters, createParameter, updateParameter, updateParameterStatus, deleteParameter } = parameterCtrl;

routerParameter.get("/listParameters", listParameters);

routerParameter.get("/filterParameters", filterParameters);

routerParameter.post("/createParameter",[
    parameterHelper.validateCreate,
    valideFields
],createParameter);

routerParameter.put("/updateParameter/:id",[
    parameterHelper.validateUpdate,
    valideFields
],updateParameter);

routerParameter.put("/updateParameterStatus/:id",[
    parameterHelper.validateStatusUpdate,
],updateParameterStatus);

routerParameter.delete("/deleteParameter/:id",[
    parameterHelper.validateDelete,
    valideFields
],deleteParameter);

export { routerParameter };