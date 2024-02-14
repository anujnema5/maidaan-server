import { Router } from "express";

import passport from "passport";
import {
    googleAuth,
    signUpUser,
    signinUser,
    userAccessRefershToken
} from "@/controllers/user-auth.controllers";

import { verifyUser } from "@/middlewares/auth.middleware";

import {
    createBooking,
    getAllusers,
    getAllusersWithBookings,
    getUserFromID,
    getUserFromIDWithBookings,
    getUsersBookings,
    deleteUserFromId,
    getUserBooking
} from "@/controllers/user.controllers";

const router = Router();

// ALL AUTH ROUTES
// CREDENTIALS SIGN-IN/UP
router.route('/auth/sign-in').post(signinUser)
router.route('/auth/sign-up').post(signUpUser)
router.route('/auth/refresh-token').post(userAccessRefershToken)

// GOOGLE PROVIDERS SIGN-IN/UP
router.route('/auth/google').get(passport.authenticate('google', { scope: ["profile", "email"] }))
router.route('/auth/google/callback').get(passport.authenticate('google', { session: false }), googleAuth)

// GET USER BY ID
router.route('/get/:userId/').get(getUserFromID)
router.route('/get/:userId/bookings').get(getUserFromIDWithBookings)

// DELETE USER
// DEV PURPOSE ONLY, A SIGN-IN USER CAN ONLY DELETE HIS ACCOUNT
router.route("/:userId/").delete(deleteUserFromId)

// DELETE USER FOR PROD 
router.route("/").delete(verifyUser, deleteUserFromId)

// DEV PURPOSE (NO PRODUCTION ROLL-OUT)
router.route('/:userId/get-user-bookings').get(getUserBooking)
router.route("/get-all-users-with-bookings").get(getAllusersWithBookings)

// GET USER BOOKING
router.route('/get-user-booking').get(verifyUser, getUserBooking)

// CREATE BOOKING
router.route("/create-booking").post(verifyUser, createBooking)

export default router;