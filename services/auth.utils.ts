import { NextFunction, Request, Response } from "express";

interface RoleAuthentication extends Request {
    role: Role
}

export enum Role {
    user = "user",
    tc = "tc"
}

export const roles = (role: Role) => {
    return (req: RoleAuthentication, res: Response, next: NextFunction) => {
        // SOME LOGIC based on the 'role'
        // For example, you might check the user's role from req.user or any other source
        console.log("first")
        req.role = role
        next()
    };
}