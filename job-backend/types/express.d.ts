import type { Types } from "mongoose";

declare global {
  namespace Express {
    interface UserIdentity {
      _id?: Types.ObjectId | string;
      id?: Types.ObjectId | string;
      role?: string;
    }

    interface Request {
      user?: UserIdentity;
    }
  }
}

export { };
