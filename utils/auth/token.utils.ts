import { db } from "@/db";
import jwt from 'jsonwebtoken';
import { getUserById, getTcById } from "@/utils/api/user.utils";

const generateToken = (data: any, secret: string, expiry: string) =>
    jwt.sign(data, secret, { expiresIn: expiry });

export const generateAccessRefreshToken = async (id: any, isTurfCaptain: boolean = false) => {
    try {
        const entity = isTurfCaptain ? await getTcById(id) : await getUserById(id);
        const updateFunction = isTurfCaptain ? (db.turfcaptain.update as any) : (db.user.update as any);

        const accessToken = isTurfCaptain ? tcGenerateAccessToken(entity) : generateAccessToken(entity);
        const refreshToken = isTurfCaptain ? tcGenerateRefreshToken(entity?.id) : generateRefreshToken(entity?.id);

        await updateFunction({ where: { id }, data: { refreshToken } });

        return { accessToken, refreshToken };
    } catch (error) {
        console.log(error);
    }
};

const generateAccessToken = (user: any) =>
    generateToken({ userId: user?.id, email: user?.email }, process.env.ACCESS_TOKEN_SECRET as string, process.env.ACCESS_TOKEN_EXPIRY as string);

const generateRefreshToken = (userID: any) => {
    console.log("Token refreshed");
    return generateToken({ userId: userID }, process.env.REFRESH_TOKEN_SECRET as string, process.env.REFRESH_TOKEN_EXPIRY as string);
};

const tcGenerateAccessToken = (tc: any) =>
    generateToken({ tcId: tc?.id, email: tc?.email }, process.env.TC_ACCESS_TOKEN_SECRET as string, process.env.TC_ACCESS_TOKEN_EXPIRY as string);

const tcGenerateRefreshToken = (tcId: any) => {
    console.log("Token refreshed");
    return generateToken({ userId: tcId }, process.env.TC_REFRESH_TOKEN_SECRET as string, process.env.TC_REFRESH_TOKEN_EXPIRY as string);
};
