import { db } from "@/db";
import { AuthenticatedRequest, requestBookingDetails } from "@/utils/static/types";
import { getAllEntities } from "@/services/global.utils";
import { isOverLappingBookings, isValidDateTime, makeBooking } from "@/services/booking.utils";
import { deleteUserById, getUserById } from "@/services/user.utils";
import { Turf, Turfcaptain } from "@prisma/client";
import { Request, Response } from "express";
import { uploadOnCloudinary } from "@/services/cloudinary.utils";
import { userResponse } from "@/utils/handleResponse";

export const getUser = async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user.id || req.params.userId

    await userResponse(req, res, async () => {
        const user = await getUserById(userId)
        return user;
    })
}

export const deleteUser = async (req: AuthenticatedRequest, res: Response) => {
    await userResponse(req, res, async () => {
        const userId = req.user?.id
        const deletedUser = await deleteUserById(userId)
        return deletedUser
    })
}

export const uploadAvatar = async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id
    const avatar = req.file as Express.Multer.File

    await userResponse(req, res, async () => {
        const response = await uploadOnCloudinary(avatar.path)
        const upadtedUserWithAvatar = await db.account.update({
            data: { avatar: response?.url },
            where: { userId: userId }
        })

        return upadtedUserWithAvatar
    })
}

export const deleteAvatar = async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id

    await userResponse(req, res, async () => {
        const deleteAvatarUser = await db.account.update({
            data: { avatar: null },
            where: { userId: userId }
        })

        return deleteAvatarUser
    })
}

export const changeAvatar = async (req: AuthenticatedRequest, res: Response) => {

    const userId = req.user?.id
    const newAvatar = req.file as Express.Multer.File

    if (!newAvatar) {
        return res.status(400).json({ message: 'Avatar is missing in the request' });
    }

    await userResponse(req, res, async () => {
        const response = await uploadOnCloudinary(newAvatar.path)
        const updatedUser = await db.account.update({
            data: { avatar: response?.url },
            where: { userId: userId }
        })

        return updatedUser;
    })
}