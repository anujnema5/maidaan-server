import { Response } from "express";
import { ApiError } from "./ApiError.utils";

export const tryCatchHandler = async (res: Response, logic: () => Promise<any>) => {
    try {
        await logic();
    } catch (error) {
        console.log(error);
        throw new ApiError(500,"Something went wrong")
    }
}