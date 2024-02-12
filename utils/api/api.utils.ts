import { Response } from "express";

export const getAllEntities = async (model: any, res: Response) => {
    try {
        const entities = await model.findMany();
        return res.status(200).json(entities);
    } catch (error) {
        console.log(error);
    }
};