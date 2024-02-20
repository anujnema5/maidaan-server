import { AuthenticatedRequest } from "@/utils/static/types";
import { getTcById, getUserById } from "@/services/user.utils";
import { NextFunction, Request, Response } from "express";
import { verify, TokenExpiredError } from 'jsonwebtoken';

export const verifyUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken || req.body.accessToken || req.header("Authorization")?.replace("Bearer ", "")

    if (!token) {
        return res.status(401).json({ message: "Unauthorize request" })
    }

    try {
        const decodedToken = verify(token, process.env.ACCESS_TOKEN_SECRET as string) as any
        const user = await getUserById(decodedToken.id)
        req.user = user
        next();

    } catch (error) {
        if (error instanceof TokenExpiredError) {
            console.log("Token expired")
            return res.status(401).json({ messge: "Token expired" })
        }
        return res.status(401).json({ message: "Suspicious activity detected" })
    }
}

export const verifyTc = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken || req.body.accessToken || req.header("Authorization")?.replace("Bearer ", "")

    if (!token) {
        return res.status(401).json({ message: "Unauthorize request" })
    }

    try {
        const decodedToken = verify(token, process.env.TC_ACCESS_TOKEN_SECRET as string) as any
        const tc = getTcById(decodedToken.id)

        req.tc = tc
        next();

    } catch (error) {
        if (error instanceof TokenExpiredError) {
            console.log("Token expired")
            return res.status(401).json({ messge: "Token expired" })
        }
        return res.status(401).json({ message: "Suspicious activity detected, someone is attaching a fake token" })
    }
}