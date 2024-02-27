import { handleResponse } from "@/utils/handleResponse";
import { Response } from "express";

export const getAllEntities = async (model: any, res: Response, selectCol = "") => {

    handleResponse(res, async () => {
        const entities = await (model.findMany as any)(
            selectCol ? { select: { [selectCol]: true } } : {}
        );

        return entities
    })
    
};