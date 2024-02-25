import { db } from "@/db";
import { AuthenticatedRequest } from "@/utils/static/types";
import { getBookingById, getEntityByField } from "@/services/user.utils";
import { Booking } from "@prisma/client";
import { Request, Response } from "express";
import { getAllEntities } from "@/services/global.utils";
import { uploadOnCloudinary } from "@/services/cloudinary.utils";

export const getTcBookings = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const tcId = req.tc?.id || req.params.tcId

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

export const confirmBooking = async (req: AuthenticatedRequest, res: Response) => {
    try {
        console.log(req.tc?.id)
        const bookingId = req.params.bookingId

        console.log(bookingId)

        if (!bookingId) {
            res.status(400).send("Invalid bookingId");
            return;
        }

        // const pendingBooking = await getBookingById(bookingId) as Booking
        const pendingBooking = await db.booking.findUnique({
            where: {
                turfCaptainId: req.tc?.id,
                id: bookingId
            }
        })

        if (!pendingBooking) {
            return res.status(404).send("Booking not found");
        }

        if (pendingBooking.status !== 'pending') {
            return res.status(403).send("Booking is not pending; access forbidden");
        }

        const confirmedBooking = await db.booking.update({
            where: { id: bookingId },
            data: { status: 'confirmed' }
        })

        return res.status(200).json(confirmedBooking)
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
        const turfCaptainId = req.tc?.id

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
    const bookingId = req.params.bookingId
    const otp = req.body.otp

    try {
        const booking = await getBookingById(bookingId)

        if (!booking) {
            return res.status(401).json({ error: "Booking not found" })
        }

        const bookingOTP = await db.bookingOTP.findUnique({ where: { bookingId } })

        if (bookingOTP?.otp !== otp) {
            return res.status(400).json({ error: "In-correct OTP" })
        }

        await db.booking.update({
            where: {
                id: bookingId
            },

            data: {
                otpConfirmed: true,
                reached: true
            }
        })


        await db.bookingOTP.delete({ where: { bookingId, otp } })

        return res.status(200).json({ success: "OTP Confirmed" })

    } catch (error) {
        return res.status(400).json({ error })
    }
}

export const editTc = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const tcId = req.tc?.id || req.params.id

        if (!tcId) {
            return res.status(400).json({ error: "TC Id Not Present" })
        }

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
    const tcId = req.tc?.id || req.params.turfCaptainId
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

        if (req.files) {

            // PERFORM THIS ACTION USING TRANSACTION
            const turfImages = req.files as Express.Multer.File[];
            // await Promise.all(
            //     turfImages.map(async (file: Express.Multer.File) => {
            //         const response = await uploadOnCloudinary(file.path);
            //         await db.turfImages.create({
            //             data: {
            //                 turfId: newTurf.id,
            //                 url: response?.url as string
            //             }
            //         })
            //     })
            // );

            await db.$transaction(async (t) => {
                await Promise.all(
                    turfImages.map(async (file: Express.Multer.File) => {
                        const response = await uploadOnCloudinary(file.path);
                        await t.turfImages.create({
                            data: {
                                turfId: newTurf.id,
                                url: response?.url as string
                            }
                        });
                    })
                );
            });
        }


        const turfWithImages = await db.turf.findUnique({
            where: {
                id: newTurf.id
            },

            include: {
                turfImages: true
            }
        })


        res.status(200).json(turfWithImages)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal Server Error", error });
    }
}

export const uploadTurfImages = async (req: AuthenticatedRequest, res: Response) => {
    // GET THE TC ID
    // GET THE TURF ID
    // GET THE PHOTOS
    // UPLOAD ON CLOUDUINARY
    // GET THE LINK
    // UPDATE THE TURF IMAGES

    const tcId = req.tc?.id;
    const turfId = req.params.turfId

    if (!tcId || !turfId) {
        return res.status(401).json({ message: "please provide both turf-captain ID and turf ID" })
    }

    if (!req.files) {
        return res.status(401).json({ message: "Please provide turf image" })
    }

    try {
        const turfImages = req.files as Express.Multer.File[]

        await db.$transaction(async (t) => {
            await Promise.all(
                turfImages.map(async (file: Express.Multer.File) => {
                    const response = await uploadOnCloudinary(file.path)
                    await t.turfImages.create({
                        data: {
                            url: response?.url as string,
                            turfId: turfId
                        }
                    })
                })
            )
        })

        return res.status(200).json({ sucess: "Successfully uploaded images for turf" })
    }

    catch (error) {

    }
}

export const deleteImage = async (req: AuthenticatedRequest, res: Response) => {
    // GET THE TC ID
    // GET THE TURF ID
    // GET THE PHOTOS
    // UPLOAD ON CLOUDUINARY
    // GET THE LINK
    // UPDATE THE 

    const tcId = req.tc?.id;

    try {

    } catch (error) {

    }
}

export const uploadAvatar = async (req: AuthenticatedRequest, res: Response) => {
    console.log(req.tc)
    const tcId = req.tc?.id
    const avatar = req.file as Express.Multer.File

    if (!tcId) {
        return res.status(400).json({ message: 'ID is missing in the request' });
    }

    if (!avatar) {
        return res.status(400).json({ message: 'Avatar is missing in the request' });
    }

    try {
        const response = await uploadOnCloudinary(avatar.path)
        const upadtedTcWithAvatar = await db.turfcaptain.update({
            data: { avatar: response?.url },
            where: { id: tcId }
        })

        return res.status(200).json({ data: upadtedTcWithAvatar });


    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const deleteAvatar = async (req: AuthenticatedRequest, res: Response) => {
    const tcId = req.tc?.id

    if (!tcId) return res.status(400).json({ message: 'ID is missing in the request' });

    try {
        const deleteAvatarTc = await db.turfcaptain.update({
            data: { avatar: null },
            where: { id: tcId }
        })

        res.status(200).json({ data: deleteAvatarTc })
    } catch (error) {

    }
}

export const changeAvatar = async (req: AuthenticatedRequest, res: Response) => {

    const tcId = req.tc?.id
    const newAvatar = req.file as Express.Multer.File

    if (!tcId) {
        return res.status(400).json({ message: 'TC ID is missing in the request' });
    }

    if (!newAvatar) {
        return res.status(400).json({ message: 'Avatar is missing in the request' });
    }

    try {
        const response = await uploadOnCloudinary(newAvatar.path)
        const updatedTurfCaptain = await db.turfcaptain.update({
            data: { avatar: response?.url },
            where: { id: tcId },
            select: { password: false }
        })

        return res.status(200).json({ data: updatedTurfCaptain })
    } catch (error) {
        console.log(error)
        res.status(501).json({error})
    }
}

export const replaceImage = async (req: AuthenticatedRequest, res: Response) => {

}

export const markTurfCaptainOffline = async (req: AuthenticatedRequest, res: Response) => {
}

export const markTurfCaptainOnline = async (req: AuthenticatedRequest, res: Response) => {

}