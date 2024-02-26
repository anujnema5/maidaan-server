import { Router } from "express";
import { cancelledBookings, confirmBooking, confirmedBookings, createBookingByTc, getTcBookings, getTurfBookings, pendingBookings, verifyOtp } from "./booking.services";

const router = Router();

router.get("/", getTcBookings);

// GET ALL BOOKINGS FOR A PARTICULAR TURF 
router.get("/:turfId/", getTurfBookings);

// CONFIRM A BOOKING
router.patch("/:bookingId/confirm-booking", confirmBooking);
router.patch("/:bookingId/otp-verification", verifyOtp);

router.post("/:turfId/create-booking", createBookingByTc);

router.get('/pending-bookings', pendingBookings)
router.get('/confirmed-bookings', confirmedBookings)
router.get('/cancelled-bookings', cancelledBookings)

export default router.use('/booking',  router)