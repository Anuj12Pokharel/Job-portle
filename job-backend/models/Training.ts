import { Schema, model, Document } from "mongoose";

export interface ITraining extends Document {
    title: string;
    description: string;
    instructor: string;
    duration: string;
    price: string;
    startDate: Date;
    image: string;
}

const trainingSchema = new Schema<ITraining>(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        instructor: { type: String, required: true },
        duration: { type: String, required: true },
        price: { type: String, required: true },
        startDate: { type: Date, required: true },
        image: { type: String, required: true },
    },
    { timestamps: true }
);

const Training = model<ITraining>("Training", trainingSchema);



export default Training;
