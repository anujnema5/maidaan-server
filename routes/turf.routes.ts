import {
    createTurf,
    editTc,
    getAllTcs,
    signUpTc,
    signinTc,
    tcAccessRefershToken,
    tcGoogleAuth,
} from "@/controllers/turf-auth.controllers";

import {
    confirmBooking,
    createBookingByTc,
    getAllTurfs,
    getTcBookings,
    getTurfBookings,
    verifyOtp
} from "@/controllers/turf.controllers";

// TO-DO - ADD COL IN TURF SCHEMA FOR OPENING AND CLOSING OF THAT TURF
// ALSO ADD THE SAME THING IN TURF CAPTAIN

import { verifyTc } from "@/middlewares/auth.middleware";
import { Router } from "express";
import passport from "passport";

const router = Router();

// AUTHENTICATIONS ROUTE
router.route('/auth/sign-in').post(signinTc)
router.route('/auth/sign-up').post(signUpTc)
router.route('/auth/refresh-token').post(tcAccessRefershToken)
router.route('/auth/google').get(passport.authenticate('google', { scope: ["profile", "email"] }))
router.route('/auth/google/callback').get(passport.authenticate('google', { session: false }), tcGoogleAuth)

// EDIT TC ACCOUNT
router.route('/edit/:id').patch(editTc)

// REGISTER / CREATE TURF
router.route('/register-turf').post(verifyTc, createTurf)

// GET ALL TURF CAPTAINS FOR DEV PURPOSE
router.route("/get-all-tcs").get(getAllTcs)

// TURF CAPTAIN BOOKING
router.route("/turf-captain-bookings").get(verifyTc, getTcBookings)

// GET ALL BOOKINGS FOR A PARTICULAR TURF 
router.route("/:turfId/turf-with-bookings").get(verifyTc, getTurfBookings)

// CONFIRM A BOOKING
router.route("/:bookingId/confirm-booking").post(verifyTc, confirmBooking)

// API WHERE TURF OWNER CAN CREATE HIS OWN BOOKING
router.route("/create-booking").post(verifyTc, createBookingByTc)
router.route("/confirm-booking") // TODO

router.route("/:bookingId/otp-verification").post(verifyTc, verifyOtp)

router.route("/get-all-turfs").get(getAllTurfs)

// SETUP OTP VERIFICATION WHEN CLIENT REACHES TO TURF

// CALENDAR API TO GET BOOKINGS -> TODAY, TOMMOROW, YESTERDAY AND PAST BOOKINGS

// NEW BOOKING REQUEST

// CONFIRMED BOOKINGS
// CANCELLED BOOKING 
// PENDING BOOKINGS
// ACCEPT BOOKING API



export default router