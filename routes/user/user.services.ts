import { db } from "@/db";
import { AuthenticatedRequest, requestBookingDetails } from "@/utils/static/types";
import { getAllEntities } from "@/services/global.utils";
import { isOverLappingBookings, isValidDateTime, makeBooking } from "@/services/booking.utils";
import { deleteUserById, getUserById } from "@/services/user.utils";
import { Turf, Turfcaptain } from "@prisma/client";
import { Request, Response } from "express";

export const createBooking = async (req: AuthenticatedRequest, res: Response) => {

    const requestBookingDetails = req.body as requestBookingDetails
    const { turfId, startTime, endTime, bookingDate } = requestBookingDetails

    const userId = await req.user?.id;

    try {
        const user = await db.user.findUnique({ where: { id: userId } })

        if (!user) {
            res.status(401).json({ error: "User does not exist, something bad detected or token expired" })
        }

        const turf = await db.turf.findUnique({
            where: { id: turfId },
            include: { turfCaptain: true }
        }) as Turf | any

        if (!turf) {
            res.status(401).json({ error: "Turf with this ID does not exist, Please make a turf" })
        }

        // const validTime = isValidDateTime(bookingDate, turf?.turfCaptain, startTime, endTime, res)


        // const isTurfAcquired = await isOverLappingBookings(startTime, endTime)

        // if (isTurfAcquired) {
        //     return res.status(400).json({ error: "Booking is full. Please choose a different date or time.", });
        // }

        // CREATE BOOKING
        const booking = await makeBooking(requestBookingDetails)
        return res.status(200).json(booking)

    } catch (error) {
        console.log(error)
        res.status(400).json({ error: error })
    }
}

export const getUserBookings = async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user.id || req.params.userId

    try {
        const user = await db.booking.findMany({
            where: { userId: userId },
        })

        return res.status(200).json(user)

    } catch (error) {

    }
}

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