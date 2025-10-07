import apprenticeModels from "../models/apprentice.model.js";
import ficheModels from "../models/fiche.model.js";

const apprenticeHelper = {};

//  VALIDAR SI YA ESTA REGISTRADO EL NUMERO DE DOCUEMENTO
apprenticeHelper.validateDocument = async (parameter, { req }) => {
  const searchDocument = await apprenticeModels.findOne({
    documentNumber: parameter,
  });

  if (searchDocument) {
    throw new Error(`El numero de documento ${parameter} ya esta  registrado`);
  }

  return true;
};

//  VALIDAR SI NO ESTA REGISTRADO EL NUMERO DE DOCUEMENTO
apprenticeHelper.validateDocumentNumber = async (parameter, { req }) => {
  const type_document = req.body.documentType;
  const searchState = await apprenticeModels.findOne({
    documentNumber: parameter,
  }).lean();
  if (!searchState) {
    throw new Error(`El aprendiz ${parameter} no esta registrado`);
  }

  if (searchState) {
    if (searchState.status == 1) {
      throw new Error(`Aprendiz Inactivo`);
    }
    if (searchState.documentType != type_document.toUpperCase()) {
      throw new Error(`El tipo de documento no coincide`);
    }
  }
  searchState.role = "APRENDIZ"
  req.apprentice = searchState;
};
// VALIDAR SI EL NUMERO DE FICHA EXISTE
apprenticeHelper.validateFiche = async (parameter, { req }) => {
  const searchFiche = await ficheModels.findOne({ number: parameter[0].fiche });
  if (!searchFiche) {
    throw new Error(
      `El numero de ficha ${parameter[0].fiche} no esta  registrado`
    );
  }
  req.fiche = searchFiche.id;
  return true;
};

// VALIDAR ID MONGO DEL APRENDIZ
apprenticeHelper.validateExsist = async (parameter) => {
  const searchState = await apprenticeModels.findById(parameter);
  if (!searchState) {
    throw new Error(`El aprendiz ${parameter} no esta registrado`);
  }
  return true;
};

// VALIDA EL SI EL CORREO INSTITUCIONAL O PERSONAL YA EXISTE
apprenticeHelper.validateEmailExists = async (parameter) => {
  const searchEmail = await apprenticeModels.findOne({
    $or: [
      {
        "email.institutional": {
          $regex: `${parameter.institutional}`,
          $options: "i",
        },
      },
      { "email.personal": { $regex: `${parameter.personal}`, $options: "i" } },
    ],
  });

  if (searchEmail) {
    throw new Error(
      `El aprendiz con el correo  ${
        searchEmail.email.institutional == parameter.institutional.toUpperCase()
          ? parameter.institutional
          : parameter.personal
      } ya esta registrado`
    );
  }

  return true;
};

// VALIDA EL SI EL CORREO INSTITUCIONAL O PERSONAL NO EXISTE
apprenticeHelper.validateEmailNotExists = async (parameter) => {
  console.log(parameter);

  const searchEmail = await apprenticeModels.findOne({
    $or: [
      {
        "email.institutional": {
          $regex: `${parameter.institutional || parameter}`,
          $options: "i",
        },
      },
      {
        "email.personal": {
          $regex: `${parameter.personal || parameter}`,
          $options: "i",
        },
      },
    ],
  });

  if (!searchEmail) {
    throw new Error(
      `El aprendiz con el correo  ${
        searchEmail.email.institutional == parameter.institutional
          ? parameter.institutional
          : parameter.personal
      } no esta registrado`
    );
  }

  return true;
};

// VALIDAR SI AL ACTUALIZAR YA EXISTE EL CORREO YA SEA PERSONAL O INSTITUCIONAL
apprenticeHelper.validateEmailUniqueForUpdate = async (parameter, { req }) => {
  const idPrimaryEmail = req.params.id;
  const searchEmail = await apprenticeModels.findOne({
    $or: [
      { "email.institutional": parameter.institutional || parameter },
      { "email.personal": parameter.personal || parameter },
    ],
  });
  if (searchEmail) {
    throw new Error(
      `El aprendiz con el correo ${
        parameter.personal || parameter.institutional || parameter
      } ya esta registrado`
    );
  }

  const searchprimaryEmail = await apprenticeModels.findById({
    _id: idPrimaryEmail,
  });

  if (
    searchprimaryEmail.email.institutional == parameter.institutional ||
    searchprimaryEmail.email.personal == parameter.personal
  ) {
    return true;
  }

  return true;
};

// VALIDA EL SI EL CORREO INSTITUCIONAL O PERSONAL EXISTE Y VALIDA EL CODIGO DE RESETEAR CONTRASEÑA
apprenticeHelper.validateResetCode = async (parameter, { req }) => {
  const apprentice = await apprenticeModels.findOne({
    $or: [
      { "email.institutional": parameter.toUpperCase() },
      { "email.personal": parameter.toUpperCase() },
    ],
  });

  if (!apprentice) {
    throw new Error(`Aprendiz no existe`);
  }

  if (apprentice.codeResetPassword == 0 || apprentice.codeTime < Date.now()) {
    await apprenticeModels.findOneAndUpdate(
      {
        $or: [
          { "email.institutional": parameter },
          { "email.personal": parameter },
        ],
      },
      { codeTime: 0, codeResetPassword: "0" }
    );
    throw new Error(`Codigo Vencido`);
  }

  req.apprentice = apprentice._id;
  return true;
};

export { apprenticeHelper };
