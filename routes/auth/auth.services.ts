import { AuthenticatedRequest, RoleRequest } from "@/utils/static/types"
import { Response } from "express"
import { generateAccessRefreshToken } from "./token.utils"
import { options } from "@/utils/static/cookie.options"

export const googleAuth = async (req: RoleRequest, res: Response) => {
    try {

        console.log(req.user)
        const { accessToken, refreshToken } =
            req.role === 'tc' ? (await generateAccessRefreshToken(req.user?.id, true) as any) :
                (await generateAccessRefreshToken(req.user?.id) as any)

        return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json({ accessToken })
    }

    catch (error) {
        return res.status(401).json(error)
    }
}