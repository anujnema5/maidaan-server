import { AuthenticatedRequest, RoleRequest } from "@/utils/static/types"
import { Response } from "express"
import { generateAccessRefreshToken } from "./token.utils"
import { options } from "@/utils/static/cookie.options"
import { ApiResponse } from "@/utils/ApiResponse.utils"
import { ApiError } from "@/utils/ApiError.utils"
import { SERVER_ERROR_MESSAGE } from "@/utils/constants"

export const tcGoogleCB = async (req: RoleRequest, res: Response) => {
    try {
        const { accessToken, refreshToken } = await generateAccessRefreshToken(req.user?.id, true) as any

        return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(new ApiResponse(200, accessToken))
    }

    catch (error) {
        console.log(error)
        throw new ApiError(401, SERVER_ERROR_MESSAGE)
    }
}

export const userGoogleCB = async (req: RoleRequest, res: Response) => {
    try {
        const { accessToken, refreshToken } = await generateAccessRefreshToken(req.user?.id) as any

        return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(new ApiResponse(200, accessToken))
    }

    catch (error) {
        console.log(error)
        throw new ApiError(401, SERVER_ERROR_MESSAGE)
    }
}