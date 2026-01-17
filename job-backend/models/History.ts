import { Schema, model, Document, Types } from "mongoose";

export interface IHistory extends Document {
    entityType: "company" | "job" | "application" | "user";
    action: "created" | "deleted" | "updated" | "applied" | "accepted" | "rejected";
    entityId: Types.ObjectId;
    entityData: any;
    performedBy: Types.ObjectId;
    performedByRole: string;
    timestamp: Date;
    details?: string;
}

const historySchema = new Schema<IHistory>(
    {
        entityType: {
            type: String,
            enum: ["company", "job", "application", "user"],
            required: true,
        },
        action: {
            type: String,
            enum: ["created", "deleted", "updated", "applied", "accepted", "rejected"],
            required: true,
        },
        entityId: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        entityData: {
            type: Schema.Types.Mixed,
            required: true,
        },
        performedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        performedByRole: {
            type: String,
            required: true,
        },
        details: {
            type: String,
        },
    },
    { timestamps: true }
);

// Index for efficient querying
historySchema.index({ entityType: 1, action: 1, createdAt: -1 });
historySchema.index({ performedBy: 1 });

export default model<IHistory>("History", historySchema);
