import { Schema, model, Document } from "mongoose";

export interface IUserForm extends Document {
  fullName?: string;
  designation?: string;
  email?: string;
  contact?: string;
  field?: string;
  employmentStatus?: string;
  resume?: string;
  createdAt?: Date;
}

const userformSchema = new Schema<IUserForm>({
  fullName: String,
  designation: String,
  email: String,
  contact: String,
  field: String,
  employmentStatus: String,
  resume: String,
  createdAt: { type: Date, default: Date.now },
});

const Userform = model<IUserForm>("Userform", userformSchema);
export default Userform;
