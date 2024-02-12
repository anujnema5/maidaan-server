import { db } from "@/db"
import jwt from 'jsonwebtoken'
import { getTcById, getUserById } from "@/utils/user.utils"

export const generateAccessRefreshToken = async (id: any) => {
    try {

        const user = await getUserById(id)

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user?.id)

        await db.user.update({ where: { id }, data: { refreshToken } })
        return { accessToken, refreshToken }


    } catch (error) {

    }
}

export const generateAccessToken = (user: any) => {
    const accessToken = jwt.sign(
        {
            userId: user?.id,
            email: user?.email
            // username: user?.username,
            // fullname: user?.fullName
        },
        process.env.ACCESS_TOKEN_SECRET as string,

        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        })

    return accessToken
}

export const generateRefreshToken = (userID: any) => {

    const refreshToken = jwt.sign(
        {
            userId: userID,
        },
        process.env.REFRESH_TOKEN_SECRET as string,

        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        })

    console.log("Token refreshed");


    return refreshToken
}

export const tcGenerateAccessRefreshToken = async (id: any) => {
    try {
        const turfCaptain = await getTcById(id)

        const accessToken = tcGenerateAccessToken(turfCaptain);

        const refreshToken = tcGenerateRefreshToken(turfCaptain?.id)

        await db.turfcaptain.update({ where: { id }, data: { refreshToken } })
        return { accessToken, refreshToken }

    } catch (error) {
        console.log(error)
    }
}

export const tcGenerateAccessToken = (tc: any) => {
    const accessToken = jwt.sign(
        {
            tcId: tc?.id,
            email: tc?.email
            // username: user?.username,
            // fullname: user?.fullName
        },
        process.env.TC_ACCESS_TOKEN_SECRET as string,

        {
            expiresIn: process.env.TC_ACCESS_TOKEN_EXPIRY
        })

    return accessToken
}

export const tcGenerateRefreshToken = (tcId: any) => {

    const refreshToken = jwt.sign(
        {
            userId: tcId,
        },
        process.env.TC_REFRESH_TOKEN_SECRET as string,

        {
            expiresIn: process.env.TC_REFRESH_TOKEN_EXPIRY
        })

    console.log("Token refreshed");


    return refreshToken
}



// export const 