import mongoose, { Document, Schema } from 'mongoose';

export interface IClientLogo extends Document {
    logo: string;
    name?: string;
    createdAt: Date;
}

const clientLogoSchema: Schema = new Schema({
    logo: { type: String, required: true },
    name: { type: String },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IClientLogo>('ClientLogo', clientLogoSchema);
