import { db } from "@/db"
import jwt from 'jsonwebtoken'
import { getUserById } from "@/utils/user.utils"

export const generateAccessRefreshToken = async (id: any) => {
    try {

        const user = await getUserById(id)

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user?.id)

        await db.user.update({where: {id},data: { refreshToken }})
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


// export const 