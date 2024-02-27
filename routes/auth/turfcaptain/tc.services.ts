import bcrypt from "bcrypt"
import { Request, Response } from "express"
import { db } from "@/db/index";
import jwt from 'jsonwebtoken'
import { generateAccessRefreshToken } from "@/routes/auth/token.utils";
import 'dotenv/config';
import { getTcByEmail, getTcById, getTcByUsernameOrEmail } from "@/services/user.utils";
import { AuthenticatedRequest } from "@/utils/static/types";
import { options } from "@/utils/static/cookie.options";
import { Prisma, Turfcaptain } from "@prisma/client";
import { getAllEntities } from "@/services/global.utils";
import { ApiResponse } from "@/utils/ApiResponse.utils";
import { ApiError } from "@/utils/ApiError.utils";
import { tryCatchResponse } from "@/utils/handleResponse";

export const signinTc = async (req: Request, res: Response) => {
    await tryCatchResponse(res, async () => {
        const { username, email, password } = req.body;

        if (!username && !email) {
            throw new ApiError(400, "Username or Email is required")
        }

        const foundTc = await db.turfcaptain.findFirst({ where: { OR: [{ username }, { email }] } }) as Turfcaptain
        const isPasswordCorrect = await bcrypt.compare(password, foundTc?.password as string)

        if (!isPasswordCorrect) {
            throw new ApiError(400, "You've entered wrong password")
        }

        const { accessToken, refreshToken } = await generateAccessRefreshToken(foundTc?.id, true) as any

        return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(new ApiResponse(200, accessToken))
    })
}

export const signUpTc = async (req: Request, res: Response) => {
    await tryCatchResponse(res, async () => {
        const requstedBody: Turfcaptain = req.body
        const { username, email, password } = requstedBody;

        const existedTc = await getTcByUsernameOrEmail(username as string, email as string)

        if (existedTc) {
            throw new ApiError(409, "Turf Captain already exists")
        }

        const hashedPassword = await bcrypt.hash(password as string, 10)

        const newTurfCaptain = await db.turfcaptain.create({
            data: {
                ...requstedBody,
                password: hashedPassword
            },
        })

        const { accessToken, refreshToken } = await generateAccessRefreshToken(newTurfCaptain.id, true) as any

        return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(new ApiResponse(200, newTurfCaptain))
    })
}

export const tcAccessRefershToken = async (req: Request, res: Response) => {
    const incomingrefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingrefreshToken) {
        throw new ApiError(401, "No refresh token found")
    }

    await tryCatchResponse(res, async () => {

        const decodedToken = jwt.verify(
            incomingrefreshToken,
            process.env.TC_REFRESH_TOKEN_SECRET as string
        ) as any


        if (!decodedToken) {
            throw new ApiError(401, "non-valid refresh token")
        }

        const foundTc = await getTcById(decodedToken?.tcId)

        if (foundTc?.refreshToken !== incomingrefreshToken) {
            throw new ApiError(401, "Token expired or already been used")
        }

        const { accessToken, refreshToken } = await generateAccessRefreshToken(foundTc?.id, true) as any

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(new ApiResponse(200, accessToken, "Accesstoken refreshed"))
    })

}

export const tcGoogleAuth = async (req: AuthenticatedRequest, res: Response) => {
    await tryCatchResponse(res, async () => {
        const { accessToken, refreshToken } = await generateAccessRefreshToken(req.tc?.id, true) as any

        return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(new ApiResponse(200, accessToken))
    })
}