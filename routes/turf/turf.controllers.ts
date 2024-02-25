import { Router } from "express";
import { changeAvatar, confirmBooking, createBookingByTc, createTurf, deleteAvatar, deleteImage, editTc, getAllTurfs, getTcBookings, getTurfBookings, markTurfCaptainOffline, markTurfCaptainOnline, replaceImage, uploadAvatar, uploadTurfImages, verifyOtp } from "./turf.services";
import { verifyTc } from "@/middlewares/auth.middleware";
import { upload } from "@/middlewares/multer.middleware";

const router = Router();

// EDIT TC ACCOUNT
router.patch('/edit/', editTc);

// CHANGE AVATAR
router.patch('/change-avatar', upload.single('avatar'), changeAvatar)

// REMOVE AVATAR
router.patch('/avatar', deleteAvatar)

// UPLOAD AVATAR
router.patch('/upload-avatar', upload.single('avatar'), uploadAvatar)

// REGISTER / CREATE TURF
router.post('/register-turf', upload.array("turf"), createTurf);

// UPLOAD IMAGES IN TURF
router.post('/:turfId/upload-images', upload.array("turf"), uploadTurfImages)

// REPLACE THE TURF'S IMAGE WITH A NEW ONE
router.put('/:turfImageId/replace-image', upload.array("turf"), replaceImage);

// DELETE IMAGE
router.delete('/:turfImageId/delete-image', deleteImage);

// TURF CAPTAIN BOOKING
router.get("/turf-captain-bookings", getTcBookings);

// GET ALL BOOKINGS FOR A PARTICULAR TURF 
router.get("/:turfId/turf-with-bookings", getTurfBookings);

// CONFIRM A BOOKING
router.post("/:bookingId/confirm-booking", confirmBooking);

// API WHERE TURF OWNER CAN CREATE HIS OWN BOOKING
router.post("/:turfId/create-booking", createBookingByTc);

// TODO: Confirm Booking (Add your route details)
router.post("/:bookingId/confirm-booking", confirmBooking);

// VERIFY OTP VIA USER'S GIVEN OTP
router.post("/:bookingId/otp-verification", verifyOtp);

// MARK TURF-CAPTAIN AS OFFLINE
router.post('/mark-offline', markTurfCaptainOffline)

// MARK TURF-CAPTAIN AS ONLINE
router.post('/mark-online', markTurfCaptainOnline)

// GET ALL TURFS
router.get("/get-all-turfs", getAllTurfs);

// API FOR UPLOADING IMAGES

export default router.use('/turf-captain', verifyTc, router);
