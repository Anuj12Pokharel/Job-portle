import { Schema, model, Document } from "mongoose";

export interface IEnrollment extends Document {
    name: string;
    email: string;
    phone: string;
    course: string;
    shift: string;
    status: "pending" | "enrolled" | "completed" | "cancelled";
    enrolledAt: Date;
    completedAt?: Date;
}

const enrollmentSchema = new Schema<IEnrollment>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        course: { type: String, required: true },
        shift: { type: String, required: true },
        status: {
            type: String,
            required: true,
            enum: ["pending", "enrolled", "completed", "cancelled"],
            default: "pending"
        },
        enrolledAt: { type: Date },
        completedAt: { type: Date }
    },
    { timestamps: true }
);

const Enrollment = model<IEnrollment>("Enrollment", enrollmentSchema);
export default Enrollment;
