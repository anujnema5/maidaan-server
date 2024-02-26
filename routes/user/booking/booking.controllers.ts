import { Router } from "express";
import { cancelledBookings, confirmedBookings, createBooking, getUserBookings, pendingBookings, totalPlays } from "./booking.services";

const router = Router();

router.get('/bookings', getUserBookings);
router.post("/create-booking", createBooking);

router.get("/total-plays", totalPlays)
router.get("/confirmed-bookings", confirmedBookings)
router.get("/pending-bookings", pendingBookings)
router.get("/cancelled-bookings", cancelledBookings)

export default router.use("/booking", router)