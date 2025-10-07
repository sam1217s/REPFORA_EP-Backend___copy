import registrationModels from "../models/registration.model.js";
import logAction from "../middlewares/log.middleware.js";

const registrationCtrl = {};

// LISTAR REGISTROS CON FILTROS
// Obtiene todos los registros con posibilidad de filtrar por diferentes campos
registrationCtrl.listRegistrations = async (req, res) => {
  try {
    const {
      registration_number,
      apprentice_id,
      modality_id,
      company_id,
      registration_status,
    } = req.query;
    let filter = {};

    // Aplicar filtros si existen
    if (registration_number) {
      filter.registration_number = {
        $regex: registration_number,
        $options: "i",
      };
    }
    if (apprentice_id) {
      filter.apprentice_id = apprentice_id;
    }
    if (modality_id) {
      filter.modality_id = modality_id;
    }
    if (company_id) {
      filter.company_id = company_id;
    }
    if (registration_status !== undefined) {
      filter.registration_status = Number(registration_status);
    }

    // Buscar registros con populate para traer datos relacionados
    const registrations = await registrationModels
      .find(filter)
      .sort({ createdAt: -1 })
      .populate("apprentice_id")
      .populate("modality_id")
      .populate("company_id")
      .populate("validated_by_id");

    res.status(200).json({ msg: registrations });
  } catch (error) {
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

// GUARDAR NUEVO REGISTRO
// El aprendiz crea un nuevo registro de etapa productiva
registrationCtrl.saveRegistration = async (req, res) => {
  try {
    const {
      registration_number,
      modality_id,
      company_id,
      scheduled_start_date,
      total_requested_hours,
      working_days,
      daily_hours,
      apprentice_observations,
      uploaded_documents,
    } = req.body;

    // Obtener el ID del aprendiz desde el token
    const apprentice = req.apprentice;

    // Crear observación inicial del aprendiz si existe
    let apprenticeObsArray = [];
    if (apprentice_observations) {
      apprenticeObsArray.push({
        descripcion: apprentice_observations.toUpperCase(),
        escrito_por: "APRENDIZ",
        fecha: Date.now(),
      });
    }

    // Crear nuevo registro
    const registration = new registrationModels({
      registration_number: registration_number.toUpperCase(),
      apprentice_id: apprentice._id,
      modality_id,
      company_id: company_id || null,
      scheduled_start_date,
      total_requested_hours,
      working_days: working_days || 5,
      daily_hours: daily_hours || 8,
      apprentice_observations: apprenticeObsArray,
      uploaded_documents: uploaded_documents || [],
    });

    await registration.save();

    // Registrar acción en logs
    await logAction(
      {
        action: "CREATE",
        affected_table: "REGISTRATIONS",
        module: "GENERAL",
        affected_record_id: registration._id,
        new_data: {
          registration_number,
          apprentice_id: apprentice._id,
          modality_id,
          company_id,
        },
        level: "INFO",
        description: "Nuevo registro de etapa productiva creado por aprendiz",
      },
      req.headers.token,
      req
    );

    res.status(200).json({ msg: "Registro creado correctamente" });
  } catch (error) {
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

// ACTUALIZAR REGISTRO
// Actualiza los datos del registro (solo campos editables por el aprendiz)
registrationCtrl.updateRegistration = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      scheduled_start_date,
      total_requested_hours,
      working_days,
      daily_hours,
      apprentice_observations,
      uploaded_documents,
    } = req.body;

    // Guardar datos anteriores para el log
    const previousData = await registrationModels.findById(id).lean();

    // Preparar objeto de actualización
    let updateData = {
      scheduled_start_date,
      total_requested_hours,
      working_days: working_days || 5,
      daily_hours: daily_hours || 8,
      uploaded_documents: uploaded_documents || [],
    };

    // Si hay nueva observación del aprendiz, agregarla al array
    if (apprentice_observations) {
      const newObservation = {
        descripcion: apprentice_observations.toUpperCase(),
        escrito_por: "APRENDIZ",
        fecha: Date.now(),
      };
      updateData.$push = { apprentice_observations: newObservation };
    }

    // Actualizar registro
    await registrationModels.findByIdAndUpdate(id, updateData);

    // Registrar acción en logs
    await logAction(
      {
        action: "UPDATE",
        affected_table: "REGISTRATIONS",
        module: "GENERAL",
        affected_record_id: id,
        previous_data: previousData,
        new_data: req.body,
        level: "INFO",
        description: "Registro de etapa productiva actualizado por aprendiz",
      },
      req.headers.token,
      req
    );

    res.status(200).json({ msg: "Registro actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

// VALIDAR REGISTRO (APROBAR O RECHAZAR)
// Permite al coordinador aprobar o rechazar un registro
registrationCtrl.validateRegistration = async (req, res) => {
  try {
    const { id } = req.params;
    const { registration_status, admin_observations } = req.body;
    const user = req.user;

    // Guardar datos anteriores para el log
    const previousData = await registrationModels.findById(id).lean();

    // Obtener el registro completo
    const registration = await registrationModels.findById(id);

    if (!registration) {
      return res.status(404).json({ msg: "Registro no encontrado" });
    }

    // Preparar observación del administrador
    const adminObservation = {
      descripcion: admin_observations
        ? admin_observations.toUpperCase()
        : "",
      escrito_por: "USUARIO",
      fecha: Date.now(),
    };

    // Actualizar estado del registro
    await registrationModels.findByIdAndUpdate(id, {
      registration_status: Number(registration_status),
      $push: { admin_observations: adminObservation },
      validated_by_id: user._id,
      validation_date: Date.now(),
    });

    // Registrar acción en logs
    await logAction(
      {
        action: "UPDATE",
        affected_table: "REGISTRATIONS",
        module: "GENERAL",
        affected_record_id: id,
        previous_data: previousData,
        new_data: {
          registration_status: Number(registration_status),
          admin_observations: adminObservation,
          validated_by_id: user._id,
        },
        level: "INFO",
        description: `Registro validado con estado: ${registration_status}`,
      },
      req.headers.token,
      req
    );

    res.status(200).json({ msg: "Registro validado correctamente" });
  } catch (error) {
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

// ELIMINAR REGISTRO
// Elimina permanentemente el registro de la base de datos
registrationCtrl.deleteRegistration = async (req, res) => {
  try {
    const { id } = req.params;

    await registrationModels.findByIdAndDelete(id);

    // Registrar acción en logs
    await logAction(
      {
        action: "DELETE",
        affected_table: "REGISTRATIONS",
        module: "GENERAL",
        affected_record_id: id,
        level: "INFO",
        description: "Registro eliminado",
      },
      req.headers.token,
      req
    );

    res.status(200).json({ msg: "Registro eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ msg: "Error en el servidor" });
  }
};



export { registrationCtrl };