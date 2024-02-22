import { Router } from "express";
import { confirmBooking, createBookingByTc, createTurf, editTc, getAllTurfs, getTcBookings, getTurfBookings, markTurfCaptainOffline, markTurfCaptainOnline, verifyOtp } from "./turf.services";
import { verifyTc } from "@/middlewares/auth.middleware";

const router = Router();

// EDIT TC ACCOUNT
router.patch('/edit/', editTc);

// REGISTER / CREATE TURF
router.post('/register-turf', createTurf);

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

router.post("/:bookingId/otp-verification", verifyOtp);

// MARK TURF-CAPTAIN AS OFFLINE
router.post('/mark-offline', markTurfCaptainOffline)

// MARK TURF-CAPTAIN AS ONLINE
router.post('/mark-online', markTurfCaptainOnline)

// GET ALL TURFS
router.get("/get-all-turfs", getAllTurfs);

// API FOR UPLOADING IMAGES

export default router.use('/turf-captain', verifyTc, router);
