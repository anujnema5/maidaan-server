import { Response } from "express";
import { ApiResponse } from "./ApiResponse.utils";
import { ApiError } from "./ApiError.utils";

export const handleResponse = async (res: Response, logic: () => Promise<any>) => {
    try {
        const result = await logic();
        return res.status(200).json(new ApiResponse(200, result))
    } catch (error) {
        console.error(error);
        return new ApiError(500, "Something went wrong");
    }
};