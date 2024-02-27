// utils/user.utils.ts
import { db } from "@/db";

export const getUserById = async (id: string, select = "") => {
    return await getEntityByField('user', 'id', id, select);
}

export const getUserByEmail = async (email: string) => {
    return await getEntityByField('user', 'email', email);
}

export const getAccountByUserId = async (id: string) => {
    return await getEntityByField('account', 'userId', id)
}

export const deleteUserById = async (id: string) => {
    return await deleteEntityByField('user', 'id', id)
}

export const getTcById = async (id: string) => {
    return await getEntityByField('turfcaptain', 'id', id);
}

export const getTurfById = async (id: string) => {
    return await getEntityByField('turf', 'id', id)
}

export const getTcByEmail = async (email: string) => {
    return await getEntityByField('turfcaptain', 'email', email);
}

export const getTcByUsernameOrEmail = async (username: string, email: string) => {
    return await (
        getEntityByField('turfcaptain', 'username', username) ||
        getEntityByField('turfcaptain', 'email', email))
}

export const getBookingById = async (id: string) => {
    return await getEntityByField('booking', 'id', id)
}

/**
 * GET AN ENTITY 
 * LIKE (USER, ACCOUNT, TURF-CAPTAIN, TURF) BY FIELD (ID, EMAIL etc.)
 * @param entity 
 * @param field 
 * @param value 
 * @param select 
 * @returns 
 */
export const getEntityByField = async (entity: 'user' | 'turfcaptain' | 'booking' | 'bookingOTP' | 'account' | 'turf', field: string, value: string, select = "") => {
    try {

        const result = await (db[entity].findUnique as any)({
            where: { [field]: value }
        });

        return result;
    } catch (error) {
        console.log(error);
        return null;
    }
};

/**
 * DELETE ANY DB ENTITY LIKE USER, ACCOUNT, TURF-CAPTAIN, TURF
 * @param entity 
 * @param fields 
 * @param value 
 * @param select 
 * @returns 
 */
export const deleteEntityByField = async (entity: 'user' | 'turfcaptain', fields: string, value: string, select = "") => {
    try {
        const deletedEntity = await (db[entity].delete as any)({
            where: { [fields]: value }
        })

        return deletedEntity;
    } catch (error) {

    }
}