import bcrypt from "bcrypt"
import { Request, Response } from "express"
import { db } from "@/db/index";
import jwt from 'jsonwebtoken'
import { generateAccessRefreshToken } from "@/utils/auth/token.utils";
import 'dotenv/config';
import { getTcByEmail, getTcById } from "@/utils/api/user.utils";
import { AuthenticatedRequest } from "@/static/types";
import { options } from "@/static/cookie.options";
import { Prisma, Turfcaptain } from "@prisma/client";
import { getAllEntities } from "@/utils/api/api.utils";

export const signinTc = async (req: Request, res: Response) => {
    try {
        // TODO: IMPLEMENT ZOD VALIDATION HERE
        const { username, email, password } = req.body;

        if (!username && !email) {
            return res.status(400).json({ message: "Username or email is required" })
        }

        const foundTc = await db.turfcaptain.findFirst({ where: { username } }) as Turfcaptain
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
        const { fullName, username, email, password, phoneNumber } = req.body

        const existedTc = await getTcByEmail(email)

        if (existedTc) {
            return res.status(409).json({ message: "Turf Captain already exists" });
        }


        else {
            const hashedPassword = await bcrypt.hash(password, 10)

            const newTurfCaptain = await db.turfcaptain.create({
                data: { username, fullName, phoneNumber, email, password: hashedPassword }
            })

            const { accessToken, refreshToken } = await generateAccessRefreshToken(newTurfCaptain.id, true) as any


            return res.status(200)
                .cookie("accessToken", accessToken, options)
                .cookie("refreshToken", refreshToken, options)
                .json({ message: "Sucess", user: newTurfCaptain })
        }
    } catch (error) {
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

export const getAllTcs = async (req: Request, res: Response) => {
    await getAllEntities(db.turfcaptain, res)
}

export const editc = async (req: Request, res: Response) => {
    try {
        const tcId = req.params.id
        const updatedFields = req.body;

        if (!updatedFields || Object.keys(updatedFields).length === 0) {
            return res.status(400).json({ error: 'Bad Request - No valid fields to update provided' });
        }

        const updatedTc = await db.turfcaptain.update({ where: { id: tcId }, data: updatedFields })

        if (!updatedTc) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.status(200).json(updatedTc)
    }

    catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal Server Error', error });
    }
}

export const createTurf = async (req: Request, res: Response) => {
    const tcId = req.params.turfCaptainId
    const turfData = req.body

    if (!turfData || typeof turfData !== 'object' || Object.keys(turfData).length === 0) {
        return res.status(400).json({ message: "Invalid request body" });
    }

    try {
        const newTurf = await db.turf.create({
            data: {
                turfCaptainId: tcId,
                ...turfData
            }
        })

        res.status(200).json(newTurf)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal Server Error", error });
    }
}