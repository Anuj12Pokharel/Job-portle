import mongoose, { Document, Schema } from "mongoose";

export interface IServiceInquiry extends Document {
  name: string;
  phone: string;
  email: string;
  address: string;
  company_size: string;
  service: string;
  message: string;
}

const ServiceInquirySchema: Schema<IServiceInquiry> = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    address: {
      type: String,
      required: true,
    },
    company_size: {
      type: String,
      required: true,
    },
    service: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IServiceInquiry>(
  "ServiceInquiry",
  ServiceInquirySchema
);
