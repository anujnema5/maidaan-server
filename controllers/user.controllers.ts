import { db } from "@/db";
import { AuthenticatedRequest, requestBookingDetails } from "@/static/types";
import { getAllEntities } from "@/utils/api/api.utils";
import { isFutureOrPresent, isOverLappingBookings, makeBooking } from "@/utils/api/booking.utils";
import { deleteUserById, getUserById } from "@/utils/api/user.utils";
import { Request, Response } from "express";

export const createBooking = async (req: AuthenticatedRequest, res: Response) => {
    const requestBookingDetails = req.body as requestBookingDetails
    const { turfId, startTime, endTime, bookingDate } = requestBookingDetails

    const userId = await req.user?.id;

    try {
        const user = await db.user.findUnique({ where: { id: userId } })

        if (!user) {
            res.status(401).json({ error: "User does not exist, something bad detected" })
        }

        const turf = await db.turf.findUnique({ where: { id: turfId } })

        if (!turf) {
            res.status(401).json({ error: "Turf with this ID does not exist, Please make a turf" })
        }

        const validDate = isFutureOrPresent(bookingDate, startTime, endTime)

        if (!validDate) {
            res.status(400).json({ error: "Invalid date" })
        }

        const isTurfAcquired = await isOverLappingBookings(startTime, endTime)

        if (isTurfAcquired) {
            return res.status(400).json({ error: "Booking is full. Please choose a different date or time.", });
        }

        // CREATE BOOKING
        const booking = await makeBooking(requestBookingDetails)

        console.log("Reaching here ", booking)

        return res.status(200).json(booking)

    } catch (error) {
        console.log(error)
        res.status(400).json({ error: error })
    }
}

export const getUsersBookings = async (req: Request, res: Response) => {
    try {
        const users = await db.user.findMany({

            select: {
                Bookings: true,
                username: true
            }
        })

        return res.status(200).json(users)
    } catch (error) {

    }
}

export const deleteUser = async (req: Request, res: Response) => {

}

export const getAllusers = async (req: Request, res: Response) => {
    console.log("Reaching here")
    const users = await db.user.findMany()
    return res.status(200).json(users)
}

export const getAllusersWithBookings = async (req: Request, res: Response) => {
    // API CREATED FOR DEV PURPOSE

    try {
        const users = await db.user.findMany({
            include: {
                Bookings: true
            }
        })

        console.log(users);


        res.status(200).json(users)
    } catch (error) {
        console.log(error)
    }
}

export const getUserBooking = async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user.id || req.params.userId

    try {
        const user = await db.user.findUnique({
            where: { id: userId },
            include: { Bookings: true }
        })

        return res.status(200).json(user)

    } catch (error) {

    }
}

export const getUserFromID = async (req: Request, res: Response) => {
    console.log("Reaching here ");
    try {
        const userId = req.params.userId


        if (!userId) {
            res.status(400).json({ message: "Please provide a userID" })
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

export const getUserFromIDWithBookings = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userid
        const user = await getUserById(userId, 'Bookings')

        res.status(200).json(user)

    } catch (error) {
        res.status(404).json(error)
    }
}