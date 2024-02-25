import { db } from "@/db"
import { getAllEntities } from "@/services/global.utils"
import { AuthenticatedRequest } from "@/utils/static/types"
import { Request, Response } from "express"

export const getAllusersWithBookings = async (req: Request, res: Response) => {
    // API CREATED FOR DEV PURPOSE

    try {
        const users = await db.user.findMany({
            include: {
                Bookings: true
            }
        })

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

export const getAllTurfs = async (req: Request, res: Response) => {
    // try {
    //     const turfs = await db.turf.findMany({
    //         include: {
    //             turfImages: true
                
    //         }
    //     });

    //     if (turfs.length <= 0) {
    //         res.send("No registered turfs found")
    //     }

    //     res.status(200).json(turfs)
    // } catch (error) {
    //     res.status(401).json(error)
    // }

    await getAllEntities(db.turf, res)
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

export const getAllBookings = async (req: Request, res: Response) => {
    try {
        const bookings = await db.booking.findMany({
            select: {
                user: true
            }
        })

        res.status(200).json(bookings)

    } catch (error) {
        console.log(error)
    }
}

export const getAllusers = async (req: Request, res: Response) => {
    const users = await db.user.findMany()
    return res.status(200).json(users)
}

export const getAllTcs = async (req: Request, res: Response) => {
    console.log(req.files?.length)
    await getAllEntities(db.turfcaptain, res)
}
