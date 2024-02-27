import { Router } from "express"
import { deleteAvatar, deleteUser, getUser, uploadAvatar } from "./user.services"
import { verifyUser } from "@/middlewares/auth.middleware"
import { changeAvatar } from "../turf-captain/turf-captain.services";
import bookingRoutes from './booking/booking.controllers'

const router = Router()

router.get('/', getUser);
router.delete("/", deleteUser)
router.patch("/edit") //TODO

router.patch("/change-avatar", changeAvatar);
router.patch("/upload-avatar", uploadAvatar);
router.patch("/remove-avatar", deleteAvatar);

router.use("/booking", bookingRoutes)

export default router.use('/user', verifyUser, router)