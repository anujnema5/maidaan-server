import { db } from "@/db"
import { requestBookingDetails } from "@/utils/static/types"
import { Turf, Turfcaptain } from "@prisma/client"
import { Response } from "express"
import '@/services/time.convertor'

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

    // ADD A CHECK FOR TOTAL PLAYER SHOULD NOT BE GREATER THAN TURF'S CAPACITY

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

    const combinedDateTime = combineDateAndTime(booking.bookingDate, endTime);

    // STORING OTP IN BookingOTP DB
    const otp = Math.floor(Math.random() * 9999).toString()

    const bookingOtp = await db.bookingOTP.create({
        data: {
            bookingId: booking.id,
            expirationDate: combinedDateTime,
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
export const isValidDateTime = (
    dateString: string,
    turfCaptain: Turfcaptain | any,
    bookingStartTime: string,
    bookingEndTime: string,
    res: Response
) => {

    console.log("booking start time " + bookingStartTime)

    // Input validation
    const inputDate = new Date(dateString);
    const isValidInput = !isNaN(inputDate.getTime());

    if (!isValidInput) {
        return res.status(400).json({ error: "Invalid date format" });
    }

    const presentDate = new Date();

    // Check if the input date is in the future or at least the present
    const isDateValid = inputDate >= presentDate;

    if (!isDateValid) {
        return res.status(401).json({ error: "Booking date cannot be in the past" });
    }

    // Check if booking time is valid
    const isTimeValid =
        bookingStartTime.convertTime() > turfCaptain?.startTime.convertTime()
    bookingStartTime.convertTime() < turfCaptain.endTime.convertTime()
        && bookingEndTime.convertTime() < turfCaptain.endTime.convertTime()
        && bookingEndTime.convertTime() > turfCaptain?.startTime.convertTime();

    // console.log(isTimeValid)

    if (!isTimeValid) {
        return res.status(401).json({ error: "Invalid booking time range" });
    }
    return isDateValid && isTimeValid;
};

export const combineDateAndTime = (dateString: any, timeString: string) => {
    const combinedDate = new Date(dateString);
  
    // Split the time string into hours and minutes
    const [hours, minutes] = timeString.split(':');
  
    // Set the hours and minutes of the combined date
    combinedDate.setHours(Number(hours));
    combinedDate.setMinutes(Number(minutes));
  
    return combinedDate;
  };
  