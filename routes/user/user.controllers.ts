import { Router } from "express"
import { createBooking, deleteAvatar, deleteUserFromId, getUserBookings, getUserFromID, uploadAvatar } from "./user.services"
import { verifyUser } from "@/middlewares/auth.middleware"
import { changeAvatar } from "../turf/turf.services";

const router = Router()

// GET USER BY ID
router.get('/', getUserFromID);
router.get('/bookings', getUserBookings);

// DELETE USER FOR PROD 
router.delete("/", deleteUserFromId);

// CREATE BOOKING
router.post("/create-booking", createBooking);

router.patch("/change-avatar", changeAvatar);
router.patch("/upload-avatar", uploadAvatar);
router.patch("/remove-avatar", deleteAvatar);

export default router.use('/user', verifyUser, router)