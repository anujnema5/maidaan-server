import { Router } from "express"
import { createBooking, deleteUserFromId, getUserBookings, getUserFromID } from "./user.services"
import { verifyUser } from "@/middlewares/auth.middleware"

const router = Router()

// GET USER BY ID
router.get('/', getUserFromID);
router.get('/bookings', getUserBookings);

// DELETE USER FOR PROD 
router.delete("/", deleteUserFromId);

// CREATE BOOKING
router.post("/create-booking", createBooking);

export default router.use('/user', verifyUser, router)