import { db } from "@/db";

export const getUserByEmail = async (email: string) => {
    try {
        const user = await db.user.findUnique({ where: { email } })
        return user;

    } catch (error) {
        return null
    }
}

export const getUserById = async (id: string) => {
    try {
        const user = await db.user.findUnique({ where: { id } })
        return user;

    } catch (error) {
        return null
    }
}

export const getTcById = async (id: string) => {
    try {
        const turfCaptain = await db.turfcaptain.findFirst({ where: { id } })
        return turfCaptain
    } catch (error) {
        console.log(error)
    }
}

export const getTcByEmail = async (email: string) => {
    try {
        const turfCaptain = await db.turfcaptain.findFirst({ where: { email } })
        return turfCaptain
    } catch (error) {
        console.log(error)
    }
}