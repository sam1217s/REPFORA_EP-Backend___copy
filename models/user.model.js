import { Schema, model } from "mongoose";

/**
 * @typedef {Object} User
 * @property {string} name - The name of the user.
 * @property {string} email - The email of the user.
 * @property {string} role - The role of the user.
 * @property {string} password - The password of the user.
 * @property {number} super - The super status of the user.
 * @property {number} status - The status of the user.
 * @property {Date} createdAt - The date when the user was created.
 * @property {Date} updatedAt - The date when the user was last updated.
 */

const UserSquema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "PROGRAMADOR", //PROGRAMADOR, COORDINADOR, CONSULTOR, EVALUADOR, USER, NOVEDADES
    },
    //array de coordinaciones
    coordinations: [
      {
        type: Schema.Types.ObjectId,
        ref: "Coordination",
      },
    ],
    password: {
      type: String,
      required: true,
    },
    super: {
      type: Number,
      default: 0,
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


export default model("User", UserSquema);
