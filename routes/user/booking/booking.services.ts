import { db } from "@/db";
import { makeBooking } from "@/services/booking.utils";
import { ApiError } from "@/utils/ApiError.utils";
import { ApiResponse } from "@/utils/ApiResponse.utils";
import { AuthenticatedRequest, requestBookingDetails } from "@/utils/static/types";
import { Turf } from "@prisma/client";
import { Response } from "express";

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

export const totalPlays = async (req: AuthenticatedRequest, res: Response) => {
    // FETCH USERID
    // THEN FOR THE BOOKING WHERE OTP IS VERIFIED

    const userId = req.user?.id;

    if (!userId) {
        return new ApiError(401, "user ID Does not exist");
    }

    try {
        const bookings = await db.booking.findMany({
            where: { userId, otpConfirmed: true, status: 'confirmed' },
        })

        // if (!bookings.length) {
        //     return new ApiError(404, "No Booking found")
        // }

        return res.status(200).json(new ApiResponse(200, bookings))
    } catch (error) {

    }
}

export const confirmedBookings = async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
        return new ApiError(401, "user ID Does not exist");
    }

    try {
        const bookings = await db.booking.findMany({
            where: { userId, status: 'confirmed' }
        })

        return res.status(200).json(new ApiResponse(200, bookings))
    }

    catch (error) {
        console.log(error)
        throw new ApiError(500, "Something went wrong while fetching confirmed bookings")
    }
}

export const pendingBookings = async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
        return new ApiError(401, "user ID Does not exist");
    }
    
    try {
        const bookings = await db.booking.findMany({
            where: { userId, status: 'pending' }
        })

        return res.status(200).json(new ApiResponse(200, bookings))
    }

    catch (error) {
        console.log(error)
        throw new ApiError(500, "Something went wrong while fetching pending bookings")
    }
}

export const cancelledBookings = async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
        return new ApiError(401, "user ID Does not exist");
    }
    
    try {
        const bookings = await db.booking.findMany({
            where: { userId, status: 'rejected' }
        })

        return res.status(200).json(new ApiResponse(200, bookings))
    }

    catch (error) {
        console.log(error)
        throw new ApiError(500, "Something went wrong while fetching pending bookings")
    }
}