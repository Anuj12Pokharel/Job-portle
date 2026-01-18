<<<<<<< HEAD
import type { Types } from "mongoose";

declare global {
  namespace Express {
    interface UserIdentity {
      _id?: Types.ObjectId | string;
      id?: Types.ObjectId | string;
      role?: string;
      [key: string]: unknown;
    }

    interface Request {
      user?: UserIdentity;
    }
  }
}

export {};

=======
import type { Types } from "mongoose";

declare global {
  namespace Express {
    interface UserIdentity {
      _id?: Types.ObjectId | string;
      id?: Types.ObjectId | string;
      role?: string;
      [key: string]: unknown;
    }

    interface Request {
      user?: UserIdentity;
    }
  }
}

export {};

>>>>>>> origin/job
