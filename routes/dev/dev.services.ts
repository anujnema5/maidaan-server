import { db } from "@/db"
import { getAllEntities } from "@/services/global.utils"
import { handleResponse } from "@/utils/handleResponse"
import { AuthenticatedRequest } from "@/utils/static/types"
import { Request, Response } from "express"

export const getAllusersWithBookings = async (req: Request, res: Response) => {
    await handleResponse(res, async () => {
        const users = await db.user.findMany({
            include: {
                Bookings: true
            }
        })

        return users;
    })
}

export const getUserBooking = async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user.id || req.params.userId

    await handleResponse(res, async () => {
        const user = await db.user.findUnique({
            where: { id: userId },
            include: { Bookings: true }
        })

        return user;
    })
}

export const getAllTurfs = async (req: Request, res: Response) => {
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

    await handleResponse(res, async () => {
        const bookings = await db.booking.findMany({
            include: {
                user: {
                    select: {
                        password: false,
                        refreshToken: false,
                        fullName: true,
                        id: true
                    }
                }
            },
        })

        return bookings
    })
}

export const getAllusers = async (req: Request, res: Response) => {
    const users = await db.user.findMany()
    return res.status(200).json(users)
}

export const getAllTcs = async (req: Request, res: Response) => {
    console.log(req.files?.length)
    await getAllEntities(db.turfcaptain, res)
}
