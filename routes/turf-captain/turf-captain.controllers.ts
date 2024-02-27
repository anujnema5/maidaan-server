import { Router } from "express";
import {
    changeAvatar,
    changeTurfCaptainStatus,
    deleteAvatar,
    deleteTc,
    editTc,
    getTc,
    totalGroundPlays,
    uploadAvatar
} from "./turf-captain.services";

import { verifyTc } from "@/middlewares/auth.middleware";
import { upload } from "@/middlewares/multer.middleware";
import bookingRoutes from './booking/booking.controllers'
import turfRoutes from './turf/turf.controllers'

const router = Router();

// BOOKINGS AND TURF ROUTES
router.use("/booking", bookingRoutes)
router.use("/turf", turfRoutes)

router.get("/",  getTc)
router.delete("/", deleteTc);
router.patch('/edit/', editTc);

// AVATAR
router.patch('/change-avatar', upload.single('avatar'), changeAvatar)
router.patch('/delete-avatar', deleteAvatar)
router.patch('/upload-avatar', upload.single('avatar'), uploadAvatar)

// MANAGE STATUS
router.post('/mark-offline', changeTurfCaptainStatus('offline'))
router.post('/mark-online', changeTurfCaptainStatus('online'))

router.get("/total-plays", totalGroundPlays)

export default router.use('/turf-captain', verifyTc, router);
