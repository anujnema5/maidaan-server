import bcrypt from "bcrypt"
import { Request, Response } from "express"
import { db } from "@/db/index";
import jwt from 'jsonwebtoken'
import { generateAccessRefreshToken } from "@/utils/auth/token.utils";
import 'dotenv/config';
import { getUserByEmail } from "@/utils/api/user.utils";
import { AuthenticatedRequest } from "@/static/types";
import { options } from "@/static/cookie.options";
import { User } from "@prisma/client";
import { getAllEntities } from "@/utils/api/api.utils";

export const signinUser = async (req: Request, res: Response) => {
    try {
        // TODO: IMPLEMENT ZOD VALIDATION HERE
        const { username, email, password } = req.body;

        if (!username && !email) {
            return res.status(400).json({ message: "Username or email is required" })
        }

        const foundUser = await db.user.findFirst({ where: { username } }) as User
        const isPasswordCorrect = await bcrypt.compare(password, foundUser?.password as string)

        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "You've entered wrong password" })
        }

        const { accessToken, refreshToken } = await generateAccessRefreshToken(foundUser.id) as any


        return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json({ accessToken })


    } catch (error) {
        console.log(error);

        return res.status(200).json(error)

    }
}

export const signUpUser = async (req: Request, res: Response) => {
    try {
        const { fullName, username, email, password, phoneNumber } = req.body

        const existedUser = await getUserByEmail(email)

        if (existedUser) {
            return res.status(409).send("User already exists");
        }

        else {

            const hashedPassword = await bcrypt.hash(password, 10)

            const newUser = await db.user.create({
                data: { username, fullName, phoneNumber, email, password: hashedPassword }
            })

            const { accessToken, refreshToken } = await generateAccessRefreshToken(newUser.id) as any


            return res.status(200)
                .cookie("accessToken", accessToken, options)
                .cookie("refreshToken", refreshToken, options)
                .json({ message: "Sucess", user: newUser })
        }
    } catch (error) {
        return res.status(400).json({ message: 'Validation failed', errors: error });
    }
}

export const userAccessRefershToken = async (req: Request, res: Response) => {
    const incomingrefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingrefreshToken) {
        return res.status(401).json({ message: "No refresh token found" })
    }

    try {
        const decodedToken = jwt.decode(incomingrefreshToken) as any

        if (!decodedToken) {
            return res.status(401).json({ message: "non-valid refresh token" })
        }

        const foundUser = await db.user.findFirst({
            where: decodedToken.userId,
            select: { id: true, password: false, refreshToken: true }
        })

        if (foundUser?.refreshToken !== incomingrefreshToken) {
            return res.status(401).json({ message: "Token expired or already been used" })
        }

        const { accessToken, refreshToken } = await generateAccessRefreshToken(foundUser?.id) as any

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json({ accessToken, refreshToken: refreshToken, message: "Accesstoken refreshed" })

    } catch (error) {
        return res.status(401).json({ message: "non-valid refresh token", error })
    }
}

export const googleAuth = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { accessToken, refreshToken } = await generateAccessRefreshToken(req.user?.id) as any

        console.log("accessToken andar wala " + accessToken);
        console.log("refreshToken andar wala " + refreshToken);

        return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json({ accessToken })

    }

    catch (error) {
        return res.status(401).json(error)
    }
}

export const getAllusers = async (req: Request, res: Response) => {
    await getAllEntities(db.user, res)
}