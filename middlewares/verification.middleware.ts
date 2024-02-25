import { AuthenticatedRequest } from "@/utils/static/types"
import { NextFunction, Response } from "express"

export const isEmailVerified = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const entityId = req.user || req.tc

    if (!entityId) {
        return res.status(200).json({ message: "Un-authenticated request" })
    }

    try {
        next();
    } 
    
    catch (error) {

    }
}