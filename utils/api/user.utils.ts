// utils/user.utils.ts
import { db } from "@/db";

export const getUserById = async (id: string) => {
    return getUserByField('user', 'id', id);
}

export const getUserByEmail = async (email: string) => {
    return getUserByField('user', 'email', email);
}

export const getTcById = async (id: string) => {
    return getUserByField('turfcaptain', 'id', id);
}

export const getTcByEmail = async (email: string) => {
    return getUserByField('turfcaptain', 'email', email);
}

const getUserByField = async (entity: 'user' | 'turfcaptain', field: string, value: string) => {
    try {
        const result = await (db[entity].findFirst as any)({
            where: { [field]: value }
        });
        return result;
    } catch (error) {
        console.log(error);
        return null;
    }
};

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