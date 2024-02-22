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

export const signinTc = async (req: Request, res: Response) => {
    try {

        /**
         *  TODO: IMPLEMENT ZOD VALIDATION HERE
         * */

        const { username, email, password } = req.body;

        if (!username && !email) {
            return res.status(400).json({ message: "Username or email is required" })
        }

        const foundTc = await db.turfcaptain.findFirst({
            where: {
                OR: [
                    { username },
                    { email }
                ]
            }
        }) as Turfcaptain

        const isPasswordCorrect = await bcrypt.compare(password, foundTc?.password as string)

        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "You've entered wrong password" })
        }

        const { accessToken, refreshToken } = await generateAccessRefreshToken(foundTc?.id, true) as any


        return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json({ accessToken })


    } catch (error) {
        console.log(error);
        return res.status(200).json(error)
    }
}

export const signUpTc = async (req: Request, res: Response) => {
    try {
        const requstedBody: Turfcaptain = req.body
        const { username, email, password } = requstedBody;

        const existedTc = await getTcByUsernameOrEmail(username as string, email as string)

        if (existedTc) {
            return res.status(409).json({ message: "Turf Captain already exists" });
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
            .json({ user: newTurfCaptain })

    }

    catch (error) {
        return res.status(400).json({ message: 'Validation failed', error });
    }
}

export const tcAccessRefershToken = async (req: Request, res: Response) => {
    const incomingrefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingrefreshToken) {
        return res.status(401).json({ message: "No refresh token found" })
    }

    try {

        const decodedToken = jwt.verify(
            incomingrefreshToken,
            process.env.TC_REFRESH_TOKEN_SECRET as string
        ) as any


        if (!decodedToken) {
            return res.status(401).json({ message: "non-valid refresh token" })
        }

        // const foundTc = await db.turfcaptain.findFirst({
        //     where: { id: decodedToken.tcId },
        //     select: { id: true, password: false, refreshToken: true }
        // })

        const foundTc = await getTcById(decodedToken?.tcId)

        if (foundTc?.refreshToken !== incomingrefreshToken) {
            return res.status(401).json({ message: "Token expired or already been used" })
        }

        const { accessToken, refreshToken } = await generateAccessRefreshToken(foundTc?.id, true) as any

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json({ accessToken, message: "Accesstoken refreshed" })

    } catch (error) {
        return res.status(401).json({ message: "non-valid refresh token", error })
    }
}

export const tcGoogleAuth = async (req: AuthenticatedRequest, res: Response) => {
    try {
        console.log(req.params)
        const { accessToken, refreshToken } = await generateAccessRefreshToken(req.tc?.id, true) as any

        return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json({ accessToken })
    }

    catch (error) {
        return res.status(401).json(error)
    }
}