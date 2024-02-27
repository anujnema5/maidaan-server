import { db } from "@/db";
import { makeBooking } from "@/services/booking.utils";
import { ApiError } from "@/utils/ApiError.utils";
import { ApiResponse } from "@/utils/ApiResponse.utils";
import { userResponse } from "@/utils/handleResponse";
import { AuthenticatedRequest, requestBookingDetails } from "@/utils/static/types";
import { $Enums, Turf } from "@prisma/client";
import { Response } from "express";

export const createBooking = async (req: AuthenticatedRequest, res: Response) => {

    const requestBookingDetails = req.body as requestBookingDetails
    const { turfId, startTime, endTime, bookingDate } = requestBookingDetails

    if (!turfId || !startTime || !endTime || !bookingDate) {
        throw new ApiError(400, "Please fill all the necessary details")
    }

    await userResponse(req, res, async () => {

        const turf = await db.turf.findUnique({
            where: { id: turfId },
            include: { turfCaptain: true }
        }) as Turf

        if (!turf) {
            throw new ApiError(401, "Turf with this ID does not exist, Please make a turf")
        }

        // const validTime = isValidDateTime(bookingDate, turf?.turfCaptain, startTime, endTime, res)

        // const isTurfAcquired = await isOverLappingBookings(startTime, endTime)

        // if (isTurfAcquired) {
        //     return res.status(400).json({ error: "Booking is full. Please choose a different date or time.", });
        // }

        // CREATE BOOKING
        const booking = await makeBooking(requestBookingDetails)
        return booking
    })
}

export const getUserBookings = async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id;

    await userResponse(req, res, async () => {
        const user = await db.booking.findMany({
            where: { userId: userId },
        })

        return user;
    })
}

export const totalPlays = async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id;

    await userResponse(req, res, async () => {
        const bookings = await db.booking.findMany({
            where: { userId, otpConfirmed: true, status: 'confirmed' },
        })

        return bookings;
    })
}

export const bookingsStatus = (status: $Enums.BookingStatus)=> {
    return async (req: AuthenticatedRequest, res: Response) => {
        const userId = req.user?.id;

        await userResponse(req, res, async () => {
            const bookings = await db.booking.findMany({
                where: { userId, status: 'confirmed' }
            })

            return bookings;
        })
    }
}