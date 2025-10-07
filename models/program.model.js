import { Schema, model } from "mongoose";

const ProgramSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    version: {
      type: String,
      required: true,
    },
    program_level: {
      type: String,
      enum: ["AUXILIAR", "TECNICO", "TECNOLOGO", "OPERARIO"],
      required: true,
    },
    admin_modality: {
      type: String,
      enum: ["PRESENCIAL", "VIRTUAL_DISTANCIA"],
      required: true,
    },
    status: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default model("Program", ProgramSchema);