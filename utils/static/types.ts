import { Request } from "express";

export interface AuthenticatedRequest extends Request {
    user?: any; // Replace 'any' with the actual type of your user object
    tc?: any
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