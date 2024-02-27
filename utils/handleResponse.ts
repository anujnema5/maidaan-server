import { Response } from "express";
import { ApiResponse } from "./ApiResponse.utils";
import { ApiError } from "./ApiError.utils";
import { AuthenticatedRequest } from "./static/types";

export const handleResponse = async (res: Response, logic: () => Promise<any>) => {
    try {
        const result = await logic();
        return res.status(200).json(new ApiResponse(200, result))
    } catch (error) {
        console.error(error);
        return new ApiError(500, "Something went wrong");
    }
};

export const userResponse = async (req: AuthenticatedRequest, res: Response, logic: () => Promise<any>) => {
    const userId = req.user?.id

    if (!userId) {
        return new ApiError(401, "TC ID is Missing")
    }

    try {
        const result = await logic();
        return res.status(200).json(new ApiResponse(200, result))

    } catch (error) {
        console.error(error);
        return new ApiError(500, "Something went wrong");
    }
}

export const tcResponse = async (req: AuthenticatedRequest, res: Response, logic: () => Promise<any>) => {
    const tcId = req.tc?.id

    if (!tcId) {
        return new ApiError(401, "TC ID is Missing")
    }

    try {
        const result = await logic();
        return res.status(200).json(new ApiResponse(200, result))

    } catch (error) {
        console.error(error);
        return new ApiError(500, "Something went wrong");
    }
}

export const tryCatchHandler = async (res: Response, logic: () => Promise<any>) => {
    try {
        await logic();
    } catch (error) {
        console.log(error);
        throw new ApiError(500,"Something went wrong")
    }
}