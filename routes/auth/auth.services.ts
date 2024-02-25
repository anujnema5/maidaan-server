import { AuthenticatedRequest, RoleRequest } from "@/utils/static/types"
import { Response } from "express"
import { generateAccessRefreshToken } from "./token.utils"
import { options } from "@/utils/static/cookie.options"

export const tcGoogleCB = async (req: RoleRequest, res: Response) => {
    try {
        const { accessToken, refreshToken } = await generateAccessRefreshToken(req.user?.id, true) as any

        return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json({ accessToken })
    }

    catch (error) {
        return res.status(401).json(error)
    }
}

export const userGoogleCB = async (req: RoleRequest, res: Response) => {
    try {
        const { accessToken, refreshToken } = await generateAccessRefreshToken(req.user?.id) as any

        return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json({ accessToken })
    }

    catch (error) {
        return res.status(401).json(error)
    }
}