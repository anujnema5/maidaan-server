import { db } from "@/db";
import { uploadOnCloudinary } from "@/services/cloudinary.utils";
import { ApiError } from "@/utils/ApiError.utils";
import { ApiResponse } from "@/utils/ApiResponse.utils";
import { AuthenticatedRequest } from "@/utils/static/types";
import { Response } from "express";

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

export const replaceTurfImage = async (req: AuthenticatedRequest, res: Response) => {
    const tcId = req.tc?.id;
    const imageId = req.params.turfImageId;
    const newTurfImage = req.file as Express.Multer.File

    if (!tcId) {
        return new ApiError(401, "TC ID Does not exist");
    }

    if (!imageId) {
        return new ApiError(401, "Image ID is missing");
    }

    if (!newTurfImage) {
        return new ApiError(401, "Turf's Input Image is missing");
    }

    try {
        const response = await uploadOnCloudinary(newTurfImage.path);
        const updatedImage = await db.turfImages.update({
            data: { url: response?.url },
            where: { id: imageId }
        })

        return res.status(200).json(new ApiResponse(200, updatedImage, "Image Updated Successfully"))
    }

    catch (error) {
        console.log(error)
        return new ApiError(500, "Something went wrong");

    }
}

export const deleteImage = async (req: AuthenticatedRequest, res: Response) => {
    const tcId = req.tc?.id;
    const imageId = req.params.turfImageId;

    if (!tcId) {
        return new ApiError(401, "TC ID Does not exist");
    }

    if (!imageId) {
        return new ApiError(401, "Image ID is missing");
    }

    try {
        const deletedImage = await db.turfImages.delete({
            where: { id: imageId }
        })

        return res.status(200).json(new ApiResponse(200, deletedImage, "Image Deleted Successfully"))
    }

    catch (error) {
        console.log(error)
        return new ApiError(500, "Something went wrong");

    }
}

export const totalTurfPlays = async (req: AuthenticatedRequest, res: Response) => {
    const tcId = req.tc?.id;
    const turfId = req.params.turfImageId;

    if (!tcId) {
        return new ApiError(401, "TC ID Does not exist");
    }

    if (!turfId) {
        return new ApiError(401, "Turf ID is missing");
    }

    try {
        const totalPlays = await db.booking.findMany({
            where: { turfId, status: 'confirmed', reached: true, otpConfirmed: true }
        })

        return res.status(200).json(new ApiResponse(200, totalPlays))
    } catch (error) {
        console.log(error)
        return new ApiError(500, "Something went wrong");
    }
} 