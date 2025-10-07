import { Schema, model } from "mongoose";

const FicheSquema = new Schema(
  {
    number: {
      type: String,
      required: true,
    },
    program: {
      type: Schema.Types.ObjectId,
      ref: "Program",
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "Instructor",
      required: true,
    },
    coordination: {
      type: Schema.Types.ObjectId,
      ref: "Coordination",
      required: true,
      
    },
    fstart: {
      type: Date,
      required: true,
    },
    fend: {
      type: Date,
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

export default model("Fiche", FicheSquema);