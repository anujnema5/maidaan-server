import { db } from "@/db"
import { requestBookingDetails } from "@/static/types"

export const makeBooking = async (requestBookingDetails: requestBookingDetails) => {
    const {
        userId,
        bookingDate,
        endTime,
        slots,
        startTime,
        totalPlayer,
        turfCaptainId,
        turfId
    } = requestBookingDetails

    const booking = await db.booking.create({
        data: {
            turfId,
            bookingDate,
            startTime,
            endTime,
            slots,
            totalPlayer,
            turfCaptainId,
            userId
        }
    })

    // STORING OTP IN BookingOTP DB
    const otp = Math.floor(Math.random() * 9999).toString()

    const bookingOtp = await db.bookingOTP.create({
        data: {
            bookingId: booking.id,
            expirationDate: booking.endTime,
            otp,
        }
    })

    return { bookingOtp, booking }
}

/**
 * HERE IS A CHECK THAT VALIDATES WEATHER A BOOKING EXIST IN THIS PARTICULAR TIME
 * IF EXISTS THEN DISCARD THE REQUEST
 * @param upcomingBookingStartTime 
 * @param upcomingBookingEndTime 
 * @returns 
 */
export const isOverLappingBookings = async (upcomingBookingStartTime: any, upcomingBookingEndTime: any) => {
    try {
        const overlappingBookings = await db.booking.findMany({
            where: {
                OR: [
                    {
                        AND: [
                            { startTime: { lte: upcomingBookingStartTime } },
                            { endTime: { gt: upcomingBookingStartTime } },
                        ],
                    },
                    {
                        AND: [
                            { startTime: { lt: upcomingBookingEndTime } },
                            { endTime: { gte: upcomingBookingEndTime } },
                        ],
                    },
                    {
                        AND: [
                            { startTime: { gte: upcomingBookingStartTime } },
                            { endTime: { lte: upcomingBookingEndTime } },
                        ],
                    },
                ],
            },
        });

        if (overlappingBookings.length > 0) {
            return false
        }

        return true
    } catch (error) {
        console.log(error)
    }
}

/**
 * THIS FUNCTION CHECKS WEATHER THE REQUESTED BOOKING DATE 
 * SHOULD BE PRESENT OR FUTURE
 * @param dateString 
 * @returns 
 */
export function isFutureOrPresent(dateString: string, startTime: string, endTime: string) {
    // Convert the input date and time string to a Date object
    const inputDate = new Date(dateString);
    const inputStartTime = new Date(startTime)
    const inputEndTime = new Date(endTime)

    // Get the current date and time
    const presentDate = new Date();

    // Check if the input date is in the future or at least the present
    return inputDate || inputStartTime || inputEndTime >= presentDate;
}