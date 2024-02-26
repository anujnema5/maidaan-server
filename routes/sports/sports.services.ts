import { db } from "@/db";
import { ApiResponse } from "@/utils/ApiResponse.utils";
import { handleResponse } from "@/utils/handleResponse";
import { $Enums } from "@prisma/client";
import { Request, Response } from "express";

export const getTurfs = (category: $Enums.Turfs) => {
    return async (req: Request, res: Response) => {
        await handleResponse(res, async () => {
            const turfs = await db.turf.findMany({
                where: { category: category }
            });

            return turfs
        });
    };
};
