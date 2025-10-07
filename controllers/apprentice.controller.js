import apprenticeModels from "../models/apprentice.model.js";
import ficheModels from "../models/fiche.model.js";
import subirArchivo from "../utils/uploadFile.util.js";
import bcrypt from "bcryptjs";
import webToken from "../middlewares/webToken.middleware.js";
import { SendEmail } from "../utils/sendEmail.util.js";
import logAction from "../middlewares/log.middleware.js";
import fs from "node:fs";
import path from "path";
import url from "url";

const apprenCtrl = {};

apprenCtrl.saveApprentice = async (req, res) => {
  const fiche = req.fiche;
  try {
    const {
      documentNumber,
      documentType,
      recordNumber,
      firstName,
      lastName,
      email,
      phone,
    } = req.body;

    const pass = bcrypt.hashSync(documentNumber, 10);
    let SaveAppre = new apprenticeModels({
      documentNumber,
      documentType: documentType.toUpperCase(),
      recordNumber: [{ fiche: fiche }],
      firstName: firstName.toUpperCase(),
      lastName: lastName.toUpperCase(),
      email: {
        institutional: email.institutional.toUpperCase(),
        personal: email.personal.toUpperCase(),
      },
      phone,
      password: pass,
    });

    await SaveAppre.save();

    await logAction(
      {
        action: "CREATE",
        affected_table: "APPRENTICES",
        module: "APPRENTICES",
        affected_record_id: SaveAppre._id,
        new_data: {
          documentNumber,
          documentType,
          recordNumber,
          firstName,
          lastName,
          email,
          phone,
        },
        level: "INFO",
        description: "Nuevo aprendiz creado",
      },
      req.headers.token,
      req
    );
    res.status(200).json({ message: "Aprendiz guardado con éxito" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

apprenCtrl.loadMassiveApprentice = async (req, res) => {
  try {
    const upload = await subirArchivo(req.files, ["csv", "txt"]);

    const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

    const filePath = path.join(__dirname, "../uploads/", upload);

    const data = fs.readFileSync(filePath, "utf8").trim();

    let lines = data.split("\n");
    lines.shift();

    const fiche = lines[0].split(";")[2];
    const idFiche = await ficheModels.find({ number: fiche }, { _id: 1 });

    const info = lines.map((line) => {
      const [
        documentNumber,
        documentType,
        recordNumber,
        firstName,
        lastName,
        emailInstitutional,
        emailPersonal,
        phone,
        password,
      ] = line.split(";");
      return {
        documentNumber,
        documentType: documentType.toUpperCase(),
        recordNumber,
        firstName: firstName.toUpperCase(),
        lastName: lastName.toUpperCase(),
        email: {
          institutional: emailInstitutional.toUpperCase(),
          personal: emailPersonal.toUpperCase(),
        },
        phone,
        password,
      };
    });

    for (let value = 0; value < info.length; value++) {
      const validateEmail = await apprenticeModels.findOne({
        $or: [
          { "email.institutional": info[value].email.institutional },
          { "email.personal": info[value].email.personal },
        ],
      });

      if (validateEmail) {
        deleteFile(filePath);
        return res.status(400).json({
          msg: `El aprendiz con el email ${
            info[value].email.institutional == validateEmail.email.institutional
              ? validateEmail.email.institutional
              : validateEmail.email.personal
          }  ya existe`,
        });
      }

      const validateDocumenNumber = await apprenticeModels.findOne({
        documentNumber: info[value].documentNumber,
      });

      if (validateDocumenNumber) {
        deleteFile(filePath);
        return res.status(400).json({
          msg: `El aprendiz con el documento ${validateDocumenNumber.documentNumber} ya existe`,
        });
      }

      info[value].password = bcrypt.hashSync(info[value].documentNumber, 10);
      info[value].recordNumber = [{ fiche: idFiche[0]._id }];
    }

    await apprenticeModels.insertMany(info);
    deleteFile(filePath);
    res.status(200).json({ msg: "Aprendiz o aprendices guardados" });
  } catch (error) {
    res.status(500).json({ msg: "error en el servidor" });
  }
};

const deleteFile = (filePath) => {
  try {
    fs.unlinkSync(filePath);
  } catch (error) {
    res.status(501).json({ msg: "error en el servidor" });
  }
};

apprenCtrl.loginApprentice = async (req, res) => {
  try {
    const { password } = req.body;
    let token = null;
    let apprentice = req.apprentice;
    const valid = bcrypt.compareSync(password, apprentice.password);
    if (!valid) {
      return res.json({ msg: "contraseña incorrecta" });
    }

    token = await webToken.generarJWT(apprentice);

    await logAction(
      {
        action: "LOGIN",
        affected_table: "APPRENTICES",
        module: "APPRENTICES",
        affected_record_id: apprentice._id,
        level: "INFO",
        description: "Inicio de sesión de aprendiz",
      },
      req.headers.token,
      req
    );

    res.json({ msg: "ususario logueado correctamente", token });
  } catch (error) {
    res.status(500).json({ msg: "error en el servidor" });
  }
};

apprenCtrl.listAprendice = async (req, res) => {
  try {
    const { recordNumber, documentNumber } = req.query;
    const filter = {};
    let idRecordnumber = null;
    if (recordNumber) {
      idRecordnumber = await ficheModels.findOne(
        { number: recordNumber },
        { _id: 1 }
      );
      if (idRecordnumber) {
        filter["recordNumber.fiche"] = idRecordnumber;
      }
    }
    if (documentNumber) {
      filter.documentNumber = documentNumber;
    }

    const Apprentice = await apprenticeModels
      .find(filter)
      .sort({ createdAt: 1 })
      .populate("recordNumber.fiche");
    res.status(200).json({ msg: Apprentice });
  } catch (error) {
    res.status(500).json({ msg: "error en el servidor" });
  }
};

apprenCtrl.updateEntireApprentice = async (req, res) => {
  try {
    const { id } = req.params;
    const { documentNumber, documentType, firstName, lastName, email, phone } = req.body;

    const previousData = await apprenticeModels.findById(id).lean();

    await apprenticeModels.findByIdAndUpdate(id, {
      phone: phone,
      "email.personal": email.personal.toUpperCase(),
      "email.institutional": email.institutional.toUpperCase(),
      documentNumber: documentNumber,
      documentType: documentType.toUpperCase(),
      firstName: firstName.toUpperCase(),
      lastName: lastName.toUpperCase(),
    });

    await logAction(
      {
        action: "UPDATE",
        affected_table: "APPRENTICES",
        module: "APPRENTICES",
        affected_record_id: id,
        previous_data: previousData,
        new_data: {
          documentNumber,
          documentType,
          firstName,
          lastName,
          email,
          phone,
        },
        level: "INFO",
        description: "Aprendiz actualizado",
      },
      req.headers.token,
      req
    );

    res.status(200).json({ msg: "Aprendiz actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

apprenCtrl.updatePartApprentice = async (req, res) => {
  try {
    const { id } = req.params;
    const { phone, email } = req.body;

    const previousData = await apprenticeModels.findById(id).lean();

    await apprenticeModels.findByIdAndUpdate(
      { _id: id },
      { phone: phone, "email.personal": email.toUpperCase() }
    );

    await logAction(
      {
        action: "UPDATE",
        affected_table: "APPRENTICES",
        module: "APPRENTICES",
        affected_record_id: id,
        previous_data: previousData,
        new_data: { phone, "email.personal": email },
        level: "INFO",
        description: "Aprendiz actualizado",
      },
      req.headers.token,
      req
    );

    res.status(200).json({ msg: "actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ msg: "error en el servidor" });
  }
};

apprenCtrl.activateApprentice = async (req, res) => {
  try {
    const { id } = req.params;
    await apprenticeModels.findByIdAndUpdate(
      { _id: id },
      {
        status: 0,
      }
    );

    await logAction(
      {
        action: "ACTIVATE",
        affected_table: "APPRENTICES",
        module: "APPRENTICES",
        affected_record_id: id,
        level: "INFO",
        description: "Estado del aprendiz activado",
      },
      req.headers.token,
      req
    );

    res.status(200).json({ msg: "Estado del aprendiz activado" });
  } catch (error) {
    res.status(500).json({ msg: "error en el servidor" });
  }
};

apprenCtrl.deleteApprentice = async (req, res) => {
  try {
    const { id } = req.params;
    await apprenticeModels.findByIdAndDelete({ _id: id });
    res.status(200).json({ msg: "Aprendiz eliminado" });
  } catch (error) {
    res.status(500).json({ msg: "error en el servidor" });
  }
};

apprenCtrl.disableApprentice = async (req, res) => {
  try {
    const { id } = req.params;
    await apprenticeModels.findByIdAndUpdate(
      { _id: id },
      {
        status: 1,
      }
    );

    await logAction(
      {
        action: "DESACTIVATE",
        affected_table: "APPRENTICES",
        module: "APPRENTICES",
        affected_record_id: id,
        level: "INFO",
        description: "Estado del aprendiz desactivado",
      },
      req.headers.token,
      req
    );

    res.status(200).json({ msg: "Estado del aprendiz desactivado" });
  } catch (error) {
    res.status(500).json({ msg: "error en el servidor" });
  }
};

apprenCtrl.resetPassword = async (req, res) => {
  try {
    const { email } = req.params;

    const resetCode = Math.floor(100000 + Math.random() * 9000);

    const timeCode = Date.now() + 1200000;

    await apprenticeModels.findOneAndUpdate(
      {
        $or: [{ "email.institutional": email }, { "email.personal": email }],
      },
      { codeResetPassword: resetCode, codeTime: timeCode }
    );
    SendEmail(
      email,
      "Asunto del correo",
      `su codigo de reestablecimiento es :${resetCode} TIEMPO VALIDO: ${new Date(
        timeCode
      ).toLocaleString("es-CO", { timeZone: "America/Bogota" })}
`
    );

    res.status(200).json({ msg: "Email enviado correctamente" });
  } catch (error) {
    res.status(500).json({ msg: "error en el servidor" });
  }
};

apprenCtrl.updatePassword = async (req, res) => {
  try {
    const { newpassword } = req.body;
    const id = req.apprentice;
    const pass = bcrypt.hashSync(newpassword, 10);
    await apprenticeModels.findByIdAndUpdate(
      { _id: id },
      { password: pass, codeTime: 0, codeResetPassword: "0" }
    );

    res.status(200).json({ msg: "Contraseña Actualizado" });
  } catch (errors) {
    res.status(500).json({ msg: "error en el servidor " });
  }
};

export { apprenCtrl };
