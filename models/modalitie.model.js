import { Schema, model } from "mongoose";

const modalitiesSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    standard_hours: { type: Number, required: true },
    requires_follow_up_instructor: {type: Number , required: true },
    requires_technical_instructor: { type: Number, required: true },
    requires_project_instructor: { type: Number, required: true },
    status: { type: Number, default: 0 },

},
    {
        timestamps: true,
    }
)

export default model("ep_modalitie", modalitiesSchema);