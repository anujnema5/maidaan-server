import { db } from "@/db";
import { AuthenticatedRequest } from "@/utils/static/types";
import { getBookingById, getEntityByField } from "@/services/user.utils";
import { Booking } from "@prisma/client";
import { Request, Response } from "express";
import { getAllEntities } from "@/services/global.utils";

export const getTcBookings = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const tcId = req.tc.id || req.params.tcId

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
        res.status(200).json(tcBookings)

    } catch (error) {
        console.log(error)
    }
}

export const getTurfBookings = async (req: Request, res: Response) => {
    try {
        const turfId = req.params.turfId

        const turfBookings = await db.booking.findMany({
            where: { turfId },
            include: {
                turf: true,
                user: true,
            }
        })

        res.status(200).json(turfBookings)
    } catch (error) {
        console.log(error)
    }
}

export const confirmBooking = async (req: Request, res: Response) => {
    try {
        const bookingId = req.params.bookingId

        if (!bookingId) {
            res.status(400).send("Invalid bookingId");
            return;
        }

        const pendingBooking = await getBookingById(bookingId) as Booking

        if (!pendingBooking) {
            res.status(404).send("Booking not found");
            return;
        }

        if (pendingBooking.status !== 'pending') {
            res.status(403).send("Booking is not pending; access forbidden");
        }

        const confirmedBooking = await db.booking.update({
            where: { id: bookingId },
            data: { status: 'confirmed' }
        })

        res.status(200).json(confirmBooking)
    }

    catch (error) {
        console.log(error)
        res.status(500).send("Internal Server Error");
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

export const getAllTurfs = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const turfCaptainId = req.tc.id

        const turfs = await db.turf.findMany({
            where: { turfCaptainId },
            include: { turfImages: true }
        });

        if (turfs.length <= 0) {
            res.send("No registered turfs found")
        }

        res.status(200).json(turfs)
    } catch (error) {
        res.status(401).json(error)
    }
}

export const verifyOtp = async (req: AuthenticatedRequest, res: Response) => {

}

export const editTc = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const tcId = req.tc.id || req.params.id
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

export const createTurf = async (req: AuthenticatedRequest, res: Response) => {
    const tcId = req.tc.id || req.params.turfCaptainId
    const turfData = req.body

    if (!turfData || typeof turfData !== 'object' || Object.keys(turfData).length === 0) {
        return res.status(400).json({ message: "Invalid request body" });
    }

    try {
        const newTurf = await db.turf.create({
            data: {
                turfCaptainId: tcId,
                ...turfData
            }
        })

        res.status(200).json(newTurf)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal Server Error", error });
    }
}

export const markTurfCaptainOffline = async (req: AuthenticatedRequest, res: Response) => {
}

export const markTurfCaptainOnline = async (req: AuthenticatedRequest, res: Response) => {

}