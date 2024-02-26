import { db } from "@/db";
import { AuthenticatedRequest } from "@/utils/static/types";
import { getBookingById, getEntityByField } from "@/services/user.utils";
import { Booking } from "@prisma/client";
import { Request, Response } from "express";
import { getAllEntities } from "@/services/global.utils";
import { uploadOnCloudinary } from "@/services/cloudinary.utils";
import { ApiError } from "@/utils/ApiError.utils";
import { ApiResponse } from "@/utils/ApiResponse.utils";

export const editTc = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const tcId = req.tc?.id || req.params.id

        if (!tcId) {
            return res.status(400).json({ error: "TC Id Not Present" })
        }

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

export const uploadAvatar = async (req: AuthenticatedRequest, res: Response) => {
    console.log(req.tc)
    const tcId = req.tc?.id
    const avatar = req.file as Express.Multer.File

    if (!tcId) {
        return res.status(400).json({ message: 'ID is missing in the request' });
    }

    if (!avatar) {
        return res.status(400).json({ message: 'Avatar is missing in the request' });
    }

    try {
        const response = await uploadOnCloudinary(avatar.path)
        const upadtedTcWithAvatar = await db.turfcaptain.update({
            data: { avatar: response?.url },
            where: { id: tcId }
        })

        return res.status(200).json({ data: upadtedTcWithAvatar });


    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const deleteAvatar = async (req: AuthenticatedRequest, res: Response) => {
    const tcId = req.tc?.id

    if (!tcId) return res.status(400).json({ message: 'ID is missing in the request' });

    try {
        const deleteAvatarTc = await db.turfcaptain.update({
            data: { avatar: null },
            where: { id: tcId }
        })

        res.status(200).json({ data: deleteAvatarTc })
    } catch (error) {

    }
}

export const changeAvatar = async (req: AuthenticatedRequest, res: Response) => {

    const tcId = req.tc?.id
    const newAvatar = req.file as Express.Multer.File

    if (!tcId) {
        return res.status(400).json({ message: 'TC ID is missing in the request' });
    }

    if (!newAvatar) {
        return res.status(400).json({ message: 'Avatar is missing in the request' });
    }

    try {
        const response = await uploadOnCloudinary(newAvatar.path)
        const updatedTurfCaptain = await db.turfcaptain.update({
            data: { avatar: response?.url },
            where: { id: tcId },
            select: { password: false }
        })

        return res.status(200).json({ data: updatedTurfCaptain })
    } catch (error) {
        console.log(error)
        res.status(501).json({error})
    }
}

export const markTurfCaptainOffline = async (req: AuthenticatedRequest, res: Response) => {

    const tcId = req.tc?.id

    if(!tcId) {
        return new ApiError(401, "Turf captain ID not found")
    }

    try {

        const offlineTurfCaptain = await db.turfcaptain.update({
            data: {status: 'offline'},
            where: {id: tcId}
        })

        return res.status(200).json(new ApiResponse(200, offlineTurfCaptain, "Switched to offline"))
        
    } catch (error) {
        console.log(error)
        return new ApiError(500, "Something went wrong while switching to offline")
    }
}

export const markTurfCaptainOnline = async (req: AuthenticatedRequest, res: Response) => {
    const tcId = req.tc?.id

    if(!tcId) {
        return new ApiError(401, "Turf captain ID not found")
    }

    try {

        const onlineTurfCaptain = await db.turfcaptain.update({
            data: {status: 'online'},
            where: {id: tcId}
        })

        return res.status(200).json(new ApiResponse(200, onlineTurfCaptain, "Switched to online"))
        
    } catch (error) {
        console.log(error)
        return new ApiError(500, "Something went wrong while switching to offline")
    }
}

export const totalGroundPlays = async (req: AuthenticatedRequest, res: Response) => {
    const tcId = req.tc?.id

    if(!tcId) {
        return new ApiError(401, "Turf captain ID not found")
    }

    try {

        const totalBookings = await db.booking.findMany({
            where: {reached: true, otpConfirmed: true, status: 'confirmed'}
        })

        return res.status(200).json(new ApiResponse(200, totalBookings))
        
    } catch (error) {
        console.log(error)
        return new ApiError(500, "Something went wrong while switching to offline")
    }
}