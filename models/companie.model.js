import { Schema, model } from "mongoose";


const companiesSchema = new Schema({
    company_nit: { type: String, required: true },
    name: { type: String, required: true },
    location: { type: String, required: true },
    legal_representative_phone: { type: String, required: true },
    legal_representative_name: { type: String, required: true },
    legal_representative_email: { type: String, required: true },
    legal_representative_position: { type: String, required: true },
    status: { type: Number, default: 0 }

}, {
    timestamps: true
})


export default model('ep_companie', companiesSchema)