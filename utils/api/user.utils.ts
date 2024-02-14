// utils/user.utils.ts
import { db } from "@/db";

export const getUserById = async (id: string, select = "") => {
    return getEntityByField('user', 'id', id, select);
}

export const getUserByEmail = async (email: string) => {
    return getEntityByField('user', 'email', email);
}

export const deleteUserById = async (id: string) => {
    return deleteEntityByField('user', 'id', id)
}

export const getTcById = async (id: string) => {
    return getEntityByField('turfcaptain', 'id', id);
}

export const getTcByEmail = async (email: string) => {
    return getEntityByField('turfcaptain', 'email', email);
}

export const getEntityByField = async (entity: 'user' | 'turfcaptain', field: string, value: string, select = "") => {
    try {

        const result = await (db[entity].findFirst as any)({
            where: { [field]: value }
            // ,select: select ? { [select]: true } : {}
        });

        return result;
    } catch (error) {
        console.log(error);
        return null;
    }
};

export const deleteEntityByField = async (entity: 'user' | 'turfcaptain', fields: string, value: string, select = "") => {
    try {
        const deletedEntity = await (db[entity].delete as any)({
            where: { [fields]: value }
        })

        return deletedEntity;
    } catch (error) {
        
    }
}

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