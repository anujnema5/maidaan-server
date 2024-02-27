import bcrypt from "bcrypt"
import { Request, Response } from "express"
import { db } from "@/db/index";
import jwt from 'jsonwebtoken'
import { generateAccessRefreshToken } from "@/routes/auth/token.utils";
import { getUserByEmail } from "@/services/user.utils";
import { AuthenticatedRequest } from "@/utils/static/types";
import { options } from "@/utils/static/cookie.options";
import { User } from "@prisma/client";
import 'dotenv/config';
import { uploadOnCloudinary } from "@/services/cloudinary.utils";
import { ApiResponse } from "@/utils/ApiResponse.utils";
import { ApiError } from "@/utils/ApiError.utils";
import { tryCatchResponse } from "@/utils/handleResponse";

export const signInUser = async (req: Request, res: Response) => {
    tryCatchResponse(res, async () => {

        const { username, email, password } = req.body;

        if (!username && !email) {
            throw new ApiError(400, "Username or email is required")
        }

        if (!password) {
            throw new ApiError(400, "Password is required")
        }

        const foundUser = await db.user.findFirst({ where: { username } }) as User
        const isPasswordCorrect = await bcrypt.compare(password, foundUser?.password as string)

        if (!isPasswordCorrect) {
            throw new ApiError(401, "You've entered wrong password")
        }

        const { accessToken, refreshToken } = await generateAccessRefreshToken(foundUser.id) as any

        return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(new ApiResponse(200, accessToken))
    })
}

export const signUpUser = async (req: Request, res: Response) => {
    const avatar = req.file as Express.Multer.File
    const { fullName, username, email, password, phoneNumber } = req.body

    if (!fullName || !username || !email || !password || !phoneNumber) {
        throw new ApiError(400, "All fields are required")
    }

    await tryCatchResponse(res, async () => {

        const existedUser = await getUserByEmail(email)

        if (existedUser) {
            throw new ApiError(409, "You've entered wrong password")
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        // WRAP THE WHOLE PROCESS IN TRANSACTION
        const newUser = await db.user.create({
            data: { username, fullName, phoneNumber, email, password: hashedPassword }
        })

        let response = null
        if (avatar) {
            response = await uploadOnCloudinary(avatar.path)
        }

        const account = await db.account.create({
            data: {
                userId: newUser.id,
                avatar: response?.url || null,
            }
        })

        const { accessToken, refreshToken } = await generateAccessRefreshToken(newUser.id) as any

        return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(new ApiResponse(200, { user: newUser, account }))

    })

}

export const userAccessRefershToken = async (req: Request, res: Response) => {
    const incomingrefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingrefreshToken) {
        throw new ApiError(401, "No refresh token found")
    }

    await tryCatchResponse(res, async () => {
        const decodedToken = jwt.decode(incomingrefreshToken) as any

        if (!decodedToken) {
            throw new ApiError(401, "non-valid refresh token")
        }

        const foundUser = await db.user.findFirst({
            where: {
                id: decodedToken.userId
            },
            select: { id: true, password: false, refreshToken: true }
        })

        if (foundUser?.refreshToken !== incomingrefreshToken) {
            throw new ApiError(401, "Token expired or already been used")
        }

        const { accessToken, refreshToken } = await generateAccessRefreshToken(foundUser?.id) as any

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(new ApiResponse(200, accessToken, "Token refreshed"))
    })
}

