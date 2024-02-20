import { Response } from "express";

export const getAllEntities = async (model: any, res: Response, selectCol="") => {
    try {
        const entities = await (model.findMany as any)(
            selectCol ? { select: { [selectCol]: true } } : {}
        );
        
        return res.status(200).json(entities);
    } catch (error) {
        console.log(error);
    }
};