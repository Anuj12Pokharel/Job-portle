"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const historySchema = new mongoose_1.Schema({
    entityType: {
        type: String,
        enum: ["company", "job", "application", "user"],
        required: true
    },
    action: {
        type: String,
        enum: ["created", "deleted", "updated", "applied", "accepted", "rejected"],
        required: true
    },
    entityId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true
    },
    entityData: {
        type: mongoose_1.Schema.Types.Mixed,
        required: true
    },
    targetOwnerId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Admin"
    },
    performedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    performedByRole: {
        type: String,
        required: true
    },
    details: {
        type: String
    }
}, { timestamps: true });
// Index for faster queries
historySchema.index({ entityType: 1, action: 1, createdAt: -1 });
const History = (0, mongoose_1.model)("History", historySchema);
exports.default = History;
