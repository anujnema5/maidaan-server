import { Router } from "express";
import { bookingStatus, confirmBooking, createBookingByTc, getTcBookings, getTurfBookings, verifyOtp } from "./booking.services";

const router = Router();

router.get("/", getTcBookings);

// GET ALL BOOKINGS FOR A PARTICULAR TURF 
router.get("/:turfId/", getTurfBookings);

// CONFIRM A BOOKING
router.patch("/:bookingId/confirm-booking", confirmBooking);
router.patch("/:bookingId/otp-verification", verifyOtp);

router.post("/:turfId/create-booking", createBookingByTc);

router.get('/pending-bookings', bookingStatus('pending'))
router.get('/confirmed-bookings', bookingStatus('confirmed'))
router.get('/cancelled-bookings', bookingStatus('rejected'))

export default router.use('/booking',  router)