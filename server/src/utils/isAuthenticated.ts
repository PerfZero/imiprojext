import { Request, Response, NextFunction } from "express";

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.session?.user) {
        next();
    } else {
        res.status(401).send("Unauthorized");
    }
};
