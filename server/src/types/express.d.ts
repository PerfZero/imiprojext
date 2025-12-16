declare global {
    namespace Express {
        interface Request {
            session?: any;
            userId?: string;
        }
    }
}

export {};
