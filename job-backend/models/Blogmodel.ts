import mongoose, { Document, Schema } from "mongoose";

export interface IBlog extends Document {
  title: string;
  body: string;
  author: string;
  date: Date;
  image?: string;
}

const blogSchema = new Schema<IBlog>({
  title: { type: String, required: true },
  body: { type: String, required: true },
  author: { type: String, required: true },
  date: { type: Date, default: Date.now },
  image: { type: String },
}, { timestamps: true });

const Blog = mongoose.model<IBlog>("Blog", blogSchema);

export default Blog;
