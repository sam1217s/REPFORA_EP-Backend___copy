/**
 * Represents an Instructor in the system.
 * @typedef {Object} Instructor
 * @property {string} name - The name of the instructor.
 * @property {string} tpdocument - The type of document of the instructor.
 * @property {string} numdocument - The number of the document of the instructor.
 * @property {string} emailpersonal - The personal email of the instructor.
 * @property {string} email - The email of the instructor.
 * @property {string} phone - The phone number of the instructor.
 * @property {string} knowledge - The knowledge area of the instructor.
 * @property {string} thematicarea - The thematic area of the instructor.
 * @property {string} bindingtype - The binding type of the instructor.
 * @property {number} caphour - The capacity hour of the instructor.
 * @property {number} hourswork - The hours worked by the instructor.
 * @property {number} status - The status of the instructor.
 * @property {Date} createdAt - The date when the instructor was created.
 * @property {Date} updatedAt - The date when the instructor was last updated.
 */
import { Schema, model } from "mongoose";


const InstructorSquema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    tpdocument: {
      type: String,
      required: true,
    },
    numdocument: {
      type: String,
      required: true,
    },
    emailpersonal: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    knowledge: {
      type: String,
      required: true,
    },
    thematicarea: {
      type: String,
      required: true,
    },
    bindingtype: {
      type: String,
      default: "",
    },
    caphour: {
      type: Number,
      default: 0,
    },
    hourswork: {
      type: Number,
      default: 0,
    },
    password: {
      type: String,
      default:''
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

export default model("Instructor", InstructorSquema);
