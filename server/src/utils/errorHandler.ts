import type { NextFunction, Request, Response } from "express";

import { AppError } from "./AppError";

export function errorHandler(
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
) {
    if (err instanceof AppError) {
        return res.status(err.status).json({ error: err.message });
    }

    console.error("Server error:", err);
    const errorMessage = process.env.NODE_ENV === 'development' 
        ? err.message 
        : "Internal server error";
    return res.status(500).json({ error: errorMessage });
}
