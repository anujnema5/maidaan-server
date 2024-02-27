import { Router } from "express";
import { bookingsStatus, createBooking, getUserBookings, totalPlays } from "./booking.services";

const router = Router();

router.get('/bookings', getUserBookings);
router.post("/create-booking", createBooking);

router.get("/total-plays", totalPlays)
router.get("/confirmed-bookings", bookingsStatus('confirmed'))
router.get("/pending-bookings", bookingsStatus('pending'))
router.get("/cancelled-bookings", bookingsStatus('rejected'))

export default router.use("/booking", router)