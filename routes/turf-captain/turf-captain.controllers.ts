import { Router } from "express";
import {
    changeAvatar,
    deleteAvatar,
    editTc,
    markTurfCaptainOffline,
    markTurfCaptainOnline,
    totalGroundPlays,
    uploadAvatar
} from "./turf-captain.services";

import { verifyTc } from "@/middlewares/auth.middleware";
import { upload } from "@/middlewares/multer.middleware";
import bookingRoutes from './booking/booking.controllers'
import turfRoutes from './turf/turf.controllers'

const router = Router();

// BOOKINGS AND TURF ROUTES
router.use(bookingRoutes)
router.use(turfRoutes)

router.get("/")
router.delete("/");

// EDIT TC ACCOUNT
router.patch('/edit/', editTc);

// AVATAR
router.patch('/change-avatar', upload.single('avatar'), changeAvatar)
router.patch('/delete-avatar', deleteAvatar)
router.patch('/upload-avatar', upload.single('avatar'), uploadAvatar)

// MANAGE STATUS
router.post('/mark-offline', markTurfCaptainOffline)
router.post('/mark-online', markTurfCaptainOnline)

router.get("/total-plays", totalGroundPlays)

export default router.use('/turf-captain', verifyTc, router);
