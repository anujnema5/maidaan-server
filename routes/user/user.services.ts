import { db } from "@/db";
import { AuthenticatedRequest, requestBookingDetails } from "@/utils/static/types";
import { getAllEntities } from "@/services/global.utils";
import { isOverLappingBookings, isValidDateTime, makeBooking } from "@/services/booking.utils";
import { deleteUserById, getUserById } from "@/services/user.utils";
import { Turf, Turfcaptain } from "@prisma/client";
import { Request, Response } from "express";
import { uploadOnCloudinary } from "@/services/cloudinary.utils";

export const deleteUser = async (req: AuthenticatedRequest, res: Response) => {

}

export const getUserFromID = async (req: AuthenticatedRequest, res: Response) => {

    try {
        const userId = req.user.id || req.params.userId

        if (!userId) {
            res.status(400).json({ message: "No user found" })
        }

        const user = await getUserById(userId)

        return res.status(200).json(user)
    } catch (error) {
        console.log(error);

        return res.status(404).json(error)
    }
}

export const deleteUserFromId = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId || req.user as string

        if (!userId) {
            res.status(401).json({ message: "Please provide a userID" })
        }

        const deletedUser = await deleteUserById(userId)
        res.status(200).json(deletedUser)

    } catch (error) {
        res.status(400).json({ message: "Please provide a userID" })
    }
}

export const uploadAvatar = async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id
    const avatar = req.file as Express.Multer.File

    if (!userId) {
        return res.status(400).json({ message: 'ID is missing in the request' });
    }

    if (!avatar) {
        return res.status(400).json({ message: 'Avatar is missing in the request' });
    }

    try {
        const response = await uploadOnCloudinary(avatar.path)
        const upadtedUserWithAvatar = await db.account.update({
            data: { avatar: response?.url },
            where: { userId: userId }
        })

        return res.status(200).json({ data: upadtedUserWithAvatar });


    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const deleteAvatar = async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id

    if (!userId) return res.status(400).json({ message: 'ID is missing in the request' });

    try {
        const deleteAvatarUser = await db.account.update({
            data: { avatar: null },
            where: { userId: userId }
        })

        res.status(200).json({ data: deleteAvatarUser })
    } catch (error) {

    }
}

export const changeAvatar = async (req: AuthenticatedRequest, res: Response) => {

    const userId = req.user?.id
    const newAvatar = req.file as Express.Multer.File

    if (!userId) {
        return res.status(400).json({ message: 'TC ID is missing in the request' });
    }

    if (!newAvatar) {
        return res.status(400).json({ message: 'Avatar is missing in the request' });
    }

    try {
        const response = await uploadOnCloudinary(newAvatar.path)
        const updatedUser = await db.account.update({
            data: { avatar: response?.url },
            where: { userId: userId }
        })

        return res.status(200).json({ data: updatedUser })
    } 
    
    catch (error) {
        console.log(error)
        res.status(501).json({ error })
    }
}