import { Session } from "better-auth/types";

declare global {
    namespace Express {
        interface Request {
            session?: Session | null;
            userId?: string;
        }
    }
}

export {};
