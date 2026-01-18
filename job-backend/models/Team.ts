import { Schema, model, Document } from "mongoose";

export interface ITeam extends Document {
  name: string;
  designation: string;
  bio: string;
  image?: string;
}

const teamSchema = new Schema<ITeam>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    designation: {
      type: String,
      required: true,
      trim: true,
    },
    bio: {
      type: String,
      required: true,
    },
    image: {
      type: String, // image path or cloudinary URL
    },
   
  },
  {
    timestamps: true,
  }
);

export default model<ITeam>("Team", teamSchema);
