import { Request } from "express";

export enum Role {
    user = 'user',
    tc = 'tc'
}

export interface AuthenticatedRequest extends Request {
    user?: any; // Replace 'any' with the actual type of your user object
    tc?: any
}

export interface RoleRequest extends Request {
    role?: string,
    user?: any
}

export type requestBookingDetails = {
    turfId: string,
    bookingDate: string,
    startTime: string,
    endTime: string,
    slots: number,
    totalPlayer: number,
    turfCaptainId: string,
    userId: string
}