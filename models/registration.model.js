import { Schema, model } from "mongoose";

// Schema para el registro de etapas productivas
const RegistrationSchema = new Schema(
  {
    // Número único de registro
    registration_number: {
      type: String,
      unique: true,
      required: true,
    },
    // Referencia al aprendiz
    apprentice_id: {
      type: Schema.Types.ObjectId,
      ref: "ep_apprentice",
      required: true,
    },
    // Referencia a la modalidad de etapa productiva
    modality_id: {
      type: Schema.Types.ObjectId,
      ref: "ep_modalitie",
      required: true,
    },
    // Referencia a la empresa (opcional, algunas modalidades no requieren empresa)
    company_id: {
      type: Schema.Types.ObjectId,
      ref: "ep_companie",
      required: false,
    },
    // Usuario que validó el registro
    validated_by_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    // Fecha de creación del registro
    registration_date: {
      type: Date,
      default: Date.now,
    },
    // Fecha programada de inicio de la etapa productiva
    scheduled_start_date: {
      type: Date,
      required: true,
    },
    // Total de horas solicitadas para la etapa productiva
    total_requested_hours: {
      type: Number,
      required: true,
      default: 864,
    },
    // Días laborales por semana (número)
    working_days: {
      type: Number,
      default: 5,
    },
    // Horas diarias (número)
    daily_hours: {
      type: Number,
      default: 8,
    },
    // Estado del registro: 0=APROBADO, 1=RECHAZADO, 3=PENDIENTE
    registration_status: {
      type: Number,
      default: 3,
    },
    // Observaciones del administrador (array de objetos)
    admin_observations: {
      type: Array,
      default: [],
    },
    // Documentos cargados por el aprendiz
    uploaded_documents: {
      type: Array,
      default: [],
    },
    // Observaciones del aprendiz (array de objetos)
    apprentice_observations: {
      type: Array,
      default: [],
    },
    // Fecha de validación del registro
    validation_date: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default model("ep_registration", RegistrationSchema);