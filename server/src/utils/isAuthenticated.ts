import { Request, Response, NextFunction } from "express";

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.session && "user" in req.session && req.session.user) {
        next();
    } else {
        res.status(401).send("Unauthorized");
    }
};
