import { Router } from "express";
import passport from "passport";
import {
    createBooking,
    getAllusers,
    getUsersBookings,
    googleAuth,
    signUpUser,
    signinUser,
    userAccessRefershToken
} from "@/controllers/user.controllers";
import { verifyUser } from "@/middlewares/auth.middleware";

const router = Router();

router.route("/get-all-users").get(getAllusers)

// CREDENTIALS SIGN-IN/UP
router.route('/sign-in').post(signinUser)
router.route('/sign-up').post(signUpUser)
router.route('/refresh-token').post(userAccessRefershToken)

// GOOGLE PROVIDERS SIGN-IN/UP
router.route('/google').get(passport.authenticate('google', { scope: ["profile", "email"] }))
router.route('/google/callback').get(passport.authenticate('google', { session: false }), googleAuth)

// CREATE BOOKING
router.route("/create-booking").post(verifyUser, createBooking)


router.route('/get-users-booking').get(getUsersBookings)

// EDIT USER 
// {{ _.api_url }}/user/create-booking

// ACCOUNT SETUP 

// FORGET & UPDATE PASSWORD 

// PHONE NUMBER SIGN-IN/UP 

export default router;