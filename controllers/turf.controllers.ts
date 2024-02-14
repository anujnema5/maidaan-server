import { db } from "@/db";
import { AuthenticatedRequest } from "@/static/types";
import { Request, Response } from "express";

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