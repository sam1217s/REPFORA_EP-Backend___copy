
import { Schema, model } from "mongoose";

const apprenticeSchema = new Schema({
    documentNumber: { type: String, required: true, unique: true },
    documentType: { type: String, required: true },
    recordNumber: [{
        _id: false,
        fiche: {
            type: Schema.Types.ObjectId,
            ref: "Fiche",
            required: true
        },
    }],
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: {
        institutional: { type: String, required: true },
        personal: { type: String, required: true }
    },
    phone: { type: String, required: true },
    status: { type: Number, default: 0 },
    password:{type:String},
    codeResetPassword:{type:String , default:"0"},
    codeTime:{type:Number, default: 0}
},
{ 
timestamps: true,
}
)
export default model("ep_apprentice", apprenticeSchema);