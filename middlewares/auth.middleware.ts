import { AuthenticatedRequest } from "@/utils/static/types";
import { getTcById, getUserById } from "@/services/user.utils";
import { NextFunction, Request, Response } from "express";
import { verify, TokenExpiredError } from 'jsonwebtoken';
import { Turfcaptain, User } from "@prisma/client";
import { ApiError } from "@/utils/ApiError.utils";

export const verifyUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken || req.body.accessToken || req.header("Authorization")?.replace("Bearer ", "")

    if (!token) {
        throw new ApiError(401, "Unauthorize request")
    }

    try {
        const decodedToken = verify(token, process.env.ACCESS_TOKEN_SECRET as string) as any
        const user = await getUserById(decodedToken.userId) as User
        req.user = user
        next();

    } catch (error) {
        if (error instanceof TokenExpiredError) {
            console.log("Token expired")
            throw new ApiError(401, "Token Expired")

        }
        throw new ApiError(401, "Suspicious activity detected")
    }
}

export const verifyTc = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken || req.body.accessToken || req.header("Authorization")?.replace("Bearer ", "")

    if (!token) {
        throw new ApiError(401, "Unauthorize request")
    }

    try {
        const decodedToken = verify(token, process.env.TC_ACCESS_TOKEN_SECRET as string) as any
        console.log(decodedToken)
        const tc = await getTcById(decodedToken.tcId)

        req.tc = tc as Turfcaptain
        next();

    } catch (error) {
        if (error instanceof TokenExpiredError) {
            console.log("Token expired")
            throw new ApiError(401, "Token Expired")
        }
        throw new ApiError(401, "Suspicious activity detected, someone is attaching a fake token")
    }
}