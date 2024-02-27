import { Router } from "express"
import { deleteAvatar, deleteUser, getUserFromID, uploadAvatar } from "./user.services"
import { verifyUser } from "@/middlewares/auth.middleware"
import { changeAvatar } from "../turf-captain/turf-captain.services";
import bookingRoutes from './booking/booking.controllers'

const router = Router()
router.use("/booking", bookingRoutes)

// GET USER BY ID
router.get('/', getUserFromID);

// DELETE USER FOR PROD 
router.delete("/", deleteUser); // TODO
router.patch("/edit") //TODO

router.patch("/change-avatar", changeAvatar);
router.patch("/upload-avatar", uploadAvatar);
router.patch("/remove-avatar", deleteAvatar);

export default router.use('/user', verifyUser, router)