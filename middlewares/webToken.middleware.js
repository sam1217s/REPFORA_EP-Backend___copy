import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";
import instructorModel from "../models/instructor.model.js";
import apprenticeModel from "../models/apprentice.model.js";
import "dotenv/config"

const webToken = {};
webToken.generarJWT = (uid) => {
  return new Promise((resolve, reject) => {
    const payload = { uid };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      {
        expiresIn: "48h", //48h
      },
      (err, token) => {
        if (err) {
          console.log(err);
          reject("No se pudo generar el token");
        } else {
          resolve(token);
        }
      }
    );
  });
};

webToken.validarJWT = (rolesAllowed = []) => {
  return async (req, res, next) => {
    const token = req.header("x-token");
    if (!token) {
      return res.status(401).json({
        msg: "No hay token en la peticion",
      });
    }
    try {
      const { uid } = jwt.verify(token, process.env.JWT_SECRET);
      console.log(uid);
      
      if (!rolesAllowed.includes(uid.role)) {
        return res.status(403).json({
          msg: "No tiene permisos para esta acción",
        });
      }

      if (uid.role == "ETAPA PRODUCTIVA VIRTUAL" || uid.role == "ETAPA PRODUCTIVA PRESENCIAL") {
        let usuario = await userModel.findById(uid._id);
        if (!usuario) {
          return res.status(401).json({
            msg: "Token no válido ",
          });
        }

        if (usuario.status == 1) {
          return res.status(401).json({
            msg: "Usuario inactivo",
          });
        }

        req.user = usuario;
        next();
        return
      }
      else if (uid.role === "INSTRUCTOR" || uid.role === "INSTRUCTOR OWNER") {
        let instructor = await instructorModel.findById(uid._id);
        if (!instructor) {
          return res.status(401).json({
            msg: "Token no válido ",
          });
        }

        if (instructor.status == 1) {
          return res.status(401).json({
            msg: "Instructor inactivo",
          });
        }
        req.instructor = instructor;
        next();
        return
      }
      else if (uid.role === "APRENDIZ") {
        let apprentice = await apprenticeModel.findById(uid._id);
        if (!apprentice) {
          return res.status(401).json({
            msg: "Token no válido ",
          });
        }

        if (apprentice.status == 1) {
          return res.status(401).json({
            msg: "Aprendiz inactivo",
          });
        }
        req.apprentice = apprentice;
        next();
        return
      }
      else {
        return res.status(401).json({
          msg: "ROL NO VÁLIDO",
        });
      }

    } catch (error) {
      res.status(401).json({
        msg: "Token no valido",
      });
    }
  };
}


export default webToken;