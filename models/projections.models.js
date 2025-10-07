import { Schema, model } from "mongoose";

const projectionSchema = new Schema({
    instructor: {
        type: Schema.Types.ObjectId,
        ref: "Instructor",
        required: true,
    },
    modality: {
        type: Schema.Types.ObjectId,
        ref: "Modalities",
        required: true,
    },
    activity_type: {
        type: String,
        enum: ["logbook", "follow_up", "technical_project", "business_project"],
        required: true
    },
    projection_month: { type: Date, default: null },
    scheduled_hours_month: { type: Number, require: true },
    observations: { type: String, default: null, },
    status: {
        type: Number,
        default: 0,
    },
},
    {
        timestamps: true,
    }
)

export default model("Projection", projectionSchema); 