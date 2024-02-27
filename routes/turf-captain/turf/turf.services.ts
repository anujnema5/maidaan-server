import { db } from "@/db";
import { uploadOnCloudinary } from "@/services/cloudinary.utils";
import { getEntityByField, getTurfById } from "@/services/user.utils";
import { ApiError } from "@/utils/ApiError.utils";
import { ApiResponse } from "@/utils/ApiResponse.utils";
import { tcResponse } from "@/utils/handleResponse";
import { AuthenticatedRequest } from "@/utils/static/types";
import { Response } from "express";

export const getAllTurfs = async (req: AuthenticatedRequest, res: Response) => {
    await tcResponse(req, res, async () => {
        const turfCaptainId = req.tc?.id

        const turfs = await db.turf.findMany({
            where: { turfCaptainId },
            include: { turfImages: true }
        });

        return turfs;
    })
}

export const createTurf = async (req: AuthenticatedRequest, res: Response) => {

    await tcResponse(req, res, async () => {
        const tcId = req.tc?.id || req.params.turfCaptainId
        const turfData = req.body

        if (!turfData || typeof turfData !== 'object' || Object.keys(turfData).length === 0) {
            throw new ApiError(400, "Invalid request body")
        }

        const newTurf = await db.turf.create({
            data: {
                turfCaptainId: tcId,
                ...turfData
            }
        })


        const turfImages = req.files as Express.Multer.File[];
        if (turfImages) {

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


        return turfWithImages
    })
}

export const uploadTurfImages = async (req: AuthenticatedRequest, res: Response) => {
    const turfId = req.params.turfId

    const turfImages = req.files as Express.Multer.File[]

    if (!turfImages) {
        throw new ApiError(401, "please provide turf Images")

    }

    await tcResponse(req, res, async () => {
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

        const turf = await getTurfById(turfId)
        return turf;
    })
}

export const replaceTurfImage = async (req: AuthenticatedRequest, res: Response) => {
    const imageId = req.params.turfImageId;
    const newTurfImage = req.file as Express.Multer.File

    if (!imageId) {
        return new ApiError(401, "Image ID is missing");
    }

    if (!newTurfImage) {
        return new ApiError(401, "Turf's Input Image is missing");
    }

    await tcResponse(req, res, async () => {
        const response = await uploadOnCloudinary(newTurfImage.path);
        const updatedImage = await db.turfImages.update({
            data: { url: response?.url },
            where: { id: imageId }
        })

        return updatedImage
    })
}

export const deleteImage = async (req: AuthenticatedRequest, res: Response) => {
    const imageId = req.params.turfImageId;

    if (!imageId) {
        return new ApiError(401, "Image ID is missing");
    }

    await tcResponse(req, res, async () => {
        const deletedImage = await db.turfImages.delete({
            where: { id: imageId }
        })

        return deletedImage;
    })
}

export const totalTurfPlays = async (req: AuthenticatedRequest, res: Response) => {
    const turfId = req.params.turfImageId;

    await tcResponse(req, res, async () => {
        
        const totalPlays = await db.booking.findMany({
            where: { turfId, status: 'confirmed', reached: true, otpConfirmed: true }
        })
        
        return totalPlays;
    })
} 