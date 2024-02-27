import { db } from "@/db";
import { AuthenticatedRequest } from "@/utils/static/types";
import { getBookingById, getEntityByField } from "@/services/user.utils";
import { $Enums, Booking } from "@prisma/client";
import { Request, Response } from "express";
import { getAllEntities } from "@/services/global.utils";
import { uploadOnCloudinary } from "@/services/cloudinary.utils";
import { ApiError } from "@/utils/ApiError.utils";
import { ApiResponse } from "@/utils/ApiResponse.utils";
import { handleResponse, tcResponse } from "@/utils/handleResponse";

export const editTc = async (req: AuthenticatedRequest, res: Response) => {
    const tcId = req.tc?.id || req.params.id
    await tcResponse(req, res, async () => {
        const updatedFields = req.body;

        if (!updatedFields || Object.keys(updatedFields).length === 0) {
            throw new ApiError(400, "Bad Request - No valid fields to update provided")
        }

        const updatedTc = await db.turfcaptain.update({ where: { id: tcId }, data: updatedFields })
        return updatedTc

    })
}

export const uploadAvatar = async (req: AuthenticatedRequest, res: Response) => {
    const tcId = req.tc?.id
    const avatar = req.file as Express.Multer.File

    if (!avatar) {
        throw new ApiError(401, "Avatar not found")
    }

    await tcResponse(req, res, async () => {
        const response = await uploadOnCloudinary(avatar.path)
        const upadtedTcWithAvatar = await db.turfcaptain.update({
            data: { avatar: response?.url },
            where: { id: tcId }
        })

        return upadtedTcWithAvatar
    })
}

export const deleteAvatar = async (req: AuthenticatedRequest, res: Response) => {
    await tcResponse(req, res, async () => {
        const tcId = req.tc?.id;

        const deleteAvatarTc = await db.turfcaptain.update({
            data: { avatar: null },
            where: { id: tcId }
        })

        return deleteAvatarTc;
    })
}

export const changeAvatar = async (req: AuthenticatedRequest, res: Response) => {

    await tcResponse(req, res, async () => {
        const tcId = req.tc?.id;
        const newAvatar = req.file as Express.Multer.File

        if (!newAvatar) {
            return res.status(400).json({ message: 'Avatar is missing in the request' });
        }

        const response = await uploadOnCloudinary(newAvatar.path)
        const updatedTurfCaptain = await db.turfcaptain.update({
            data: { avatar: response?.url },
            where: { id: tcId },
            select: { password: false }
        })

        return updatedTurfCaptain;
    })
}

export const changeTurfCaptainStatus = (status: $Enums.tcStatus) => {
    return async (req: AuthenticatedRequest, res: Response) => {

        await tcResponse(req, res, async () => {
            const tcId = req.tc?.id;

            const offlineTurfCaptain = await db.turfcaptain.update({
                data: { status: status },
                where: { id: tcId }
            })

            return offlineTurfCaptain
        })
    }
}
export const totalGroundPlays = async (req: AuthenticatedRequest, res: Response) => {

    await tcResponse(req, res, async () => {
        const totalBookings = await db.booking.findMany({
            where: { reached: true, otpConfirmed: true, status: 'confirmed' }
        })

        return totalBookings
    })
}