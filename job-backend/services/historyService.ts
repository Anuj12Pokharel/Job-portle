import History, { IHistory } from "../models/History";
import { Types } from "mongoose";

interface LogHistoryParams {
    entityType: "company" | "job" | "application" | "user";
    action: "created" | "deleted" | "updated" | "applied" | "accepted" | "rejected";
    entityId: Types.ObjectId | string;
    entityData: any;
    performedBy: Types.ObjectId | string;
    performedByRole: string;
    details?: string;
}

export const logHistory = async (params: LogHistoryParams): Promise<IHistory> => {
    try {
        const history = new History({
            entityType: params.entityType,
            action: params.action,
            entityId: params.entityId,
            entityData: params.entityData,
            performedBy: params.performedBy,
            performedByRole: params.performedByRole,
            details: params.details,
        });

        await history.save();
        return history;
    } catch (error) {
        console.error("Failed to log history:", error);
        throw error;
    }
};

// Helper functions for specific entity types
export const logJobHistory = async (
    action: "created" | "deleted" | "updated",
    job: any,
    userId: string,
    userRole: string
) => {
    return logHistory({
        entityType: "job",
        action,
        entityId: job._id,
        entityData: { position: job.position, company: job.companyName, location: job.location },
        performedBy: userId,
        performedByRole: userRole,
    });
};

export const logCompanyHistory = async (
    action: "created" | "deleted" | "updated",
    company: any,
    userId: string,
    userRole: string
) => {
    return logHistory({
        entityType: "company",
        action,
        entityId: company._id,
        entityData: { companyName: company.companyName, email: company.email },
        performedBy: userId,
        performedByRole: userRole,
    });
};

export const logApplicationHistory = async (
    action: "applied" | "accepted" | "rejected",
    application: any,
    userId: string,
    userRole: string
) => {
    return logHistory({
        entityType: "application",
        action,
        entityId: application._id,
        entityData: {
            jobId: application.job,
            applicantId: application.user,
            status: application.status
        },
        performedBy: userId,
        performedByRole: userRole,
    });
};

export const logUserHistory = async (
    action: "deleted",
    user: any,
    performedById: string,
    performedByRole: string
) => {
    return logHistory({
        entityType: "user",
        action,
        entityId: user._id,
        entityData: { fullName: user.fullName, email: user.email },
        performedBy: performedById,
        performedByRole: performedByRole,
    });
};
