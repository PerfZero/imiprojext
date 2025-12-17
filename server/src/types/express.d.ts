import type { User } from "../db";

declare global {
    namespace Express {
        interface Request {
            session?: any;
            userId?: string;
            user?: User;
        }
    }
}

export {};





