import { db } from "@/db"
import { Request, Response } from "express"

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