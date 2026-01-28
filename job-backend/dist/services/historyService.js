"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHistory = exports.logHistory = void 0;
const History_1 = __importDefault(require("../models/History"));
const logHistory = async (entityType, action, entityId, entityData, performedBy, performedByRole, details, targetOwnerId // Changed to any for more flexibility
) => {
    try {
        await History_1.default.create({
            entityType,
            action,
            entityId,
            entityData,
            performedBy,
            performedByRole,
            details,
            targetOwnerId
        });
    }
    catch (err) {
        console.error("Failed to log history:", err);
        // Don't throw - logging should not block main operations
    }
};
exports.logHistory = logHistory;
const getHistory = async (filters = {}, limit = 100, skip = 0) => {
    try {
        const query = {};
        if (filters.entityType) {
            query.entityType = filters.entityType;
        }
        if (filters.action) {
            query.action = filters.action;
        }
        if (filters.targetOwnerId) {
            query.targetOwnerId = filters.targetOwnerId;
        }
        if (filters.startDate || filters.endDate) {
            query.createdAt = {};
            if (filters.startDate) {
                query.createdAt.$gte = new Date(filters.startDate);
            }
            if (filters.endDate) {
                query.createdAt.$lte = new Date(filters.endDate);
            }
        }
        const history = await History_1.default.find(query)
            .populate("performedBy", "fullName email")
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skip);
        const total = await History_1.default.countDocuments(query);
        return { history, total };
    }
    catch (err) {
        console.error("Failed to fetch history:", err);
        throw err;
    }
};
exports.getHistory = getHistory;
