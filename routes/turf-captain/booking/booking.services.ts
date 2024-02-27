import { db } from "@/db"
import { getBookingById } from "@/services/user.utils"
import { ApiError } from "@/utils/ApiError.utils"
import { ApiResponse } from "@/utils/ApiResponse.utils"
import { handleResponse } from "@/utils/handleResponse"
import { AuthenticatedRequest } from "@/utils/static/types"
import { tryCatchHandler } from "@/utils/tryCatchHandler"
import { Response } from "express"

export const getTcBookings = async (req: AuthenticatedRequest, res: Response) => {
    const tcId = req.tc?.id || req.params.tcId

    handleResponse(res, async () => {
        const tcBookings = await db.booking.findMany({
            where: { turfCaptainId: tcId },
            include: {
                turf: true,
                turfCaptain: true,
                user: {
                    select: {
                        password: false,
                        username: true
                    }
                }
            }
        })

        return tcBookings;
    })
}

export const getTurfBookings = async (req: AuthenticatedRequest, res: Response) => {
    const turfId = req.params.turfId

    handleResponse(res, async () => {

        const turfBookings = await db.booking.findMany({
            where: { turfId },
            include: {
                turf: true,
                user: true,
            }
        })

        return turfBookings;
    })

}

export const confirmBooking = async (req: AuthenticatedRequest, res: Response) => {
    tryCatchHandler(res, async () => {

        const bookingId = req.params.bookingId

        if (!bookingId) {
            throw new ApiError(400, "Invalid bookingId")
        }

        // const pendingBooking = await getBookingById(bookingId) as Booking
        const pendingBooking = await db.booking.findUnique({
            where: {
                turfCaptainId: req.tc?.id,
                id: bookingId
            }
        })

        if (!pendingBooking) {
            throw new ApiError(404, "Booking not found")
        }

        if (pendingBooking.status !== 'pending') {
            throw new ApiError(403, "Booking is not pending; access forbidden")
        }

        const confirmedBooking = await db.booking.update({
            where: { id: bookingId },
            data: { status: 'confirmed' }
        })

        return res.status(200).json(new ApiResponse(200, confirmedBooking))

    })
}

export const verifyOtp = async (req: AuthenticatedRequest, res: Response) => {
    const bookingId = req.params.bookingId
    const otp = req.body.otp

    try {
        const booking = await getBookingById(bookingId)

        if (!booking) {
            return res.status(401).json({ error: "Booking not found" })
        }

        const bookingOTP = await db.bookingOTP.findUnique({ where: { bookingId } })

        if (bookingOTP?.otp !== otp) {
            return res.status(400).json({ error: "In-correct OTP" })
        }

        await db.booking.update({
            where: {
                id: bookingId
            },

            data: {
                otpConfirmed: true,
                reached: true
            }
        })


        await db.bookingOTP.delete({ where: { bookingId, otp } })

        return res.status(200).json({ success: "OTP Confirmed" })

    } catch (error) {
        return res.status(400).json({ error })
    }
}

export const createBookingByTc = async (req: AuthenticatedRequest, res: Response) => {
    const { turfId, bookingDate, startTime, endTime, slots, totalPlayer } = req.body
    const tc = await req.tc;

    try {
        const turf = await db.turf.findUnique({ where: { id: turfId }, })

        if (!turf) {
            res.status(401).json("Turf with this ID does not exist, Please make a turf")
        }

        // TO-DO: IMPLEMENT A CHECK WHERE USER CANNOT HAVE DATE BEFORE PRESENT DATE

        // HERE IS A CHECK THAT VALIDATES WEATHER A BOOKING EXIST IN THIS PARTICULAR TIME
        // IF EXISTS THEN DISCARD THE REQUEST
        // const isTurfAcquired = await isOverLappingBookings(startTime, endTime)

        // if (isTurfAcquired) {
        //     return res.status(400).json({
        //         message: "Booking is full. Please choose a different date or time.",
        //         code: "booking_full"
        //     });
        // }

        // CREATE BOOKING
        const booking = await db.booking.create({
            data: {
                turfId,
                bookingDate,
                startTime,
                endTime,
                slots,
                totalPlayer,
                turfCaptainId: turf?.turfCaptainId,
                bookedByTurfCaptain: true
            }
        })

        console.log("Reaching here ", booking)

        return res.status(200).json(booking)

    } catch (error) {
        console.log(error)
    }
}

export const confirmedBookings = async (req: AuthenticatedRequest, res: Response) => {
    const tcId = req.tc?.id;

    if (!tcId) {
        return new ApiError(401, "TC ID Does not exist");
    }

    try {
        const bookings = await db.booking.findMany({
            where: { turfCaptainId: tcId, status: 'confirmed' }
        })

        return res.status(200).json(new ApiResponse(200, bookings))
    }

    catch (error) {
        console.log(error)
        throw new ApiError(500, "Something went wrong while fetching confirmed bookings")
    }
}

export const pendingBookings = async (req: AuthenticatedRequest, res: Response) => {
    const tcId = req.tc?.id;

    if (!tcId) {
        return new ApiError(401, "TC ID Does not exist");
    }

    try {
        const bookings = await db.booking.findMany({
            where: { turfCaptainId: tcId, status: 'pending' }
        })

        return res.status(200).json(new ApiResponse(200, bookings))
    }

    catch (error) {
        console.log(error)
        throw new ApiError(500, "Something went wrong while fetching pending bookings")
    }
}

export const cancelledBookings = async (req: AuthenticatedRequest, res: Response) => {
    const tcId = req.tc?.id;

    if (!tcId) {
        return new ApiError(401, "TC ID Does not exist");
    }

    try {
        const bookings = await db.booking.findMany({
            where: { turfCaptainId: tcId, status: 'rejected' }
        })

        return res.status(200).json(new ApiResponse(200, bookings))
    }

    catch (error) {
        console.log(error)
        throw new ApiError(500, "Something went wrong while fetching pending bookings")
    }
}
