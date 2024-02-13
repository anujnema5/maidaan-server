import {
    createTurf,
    editc,
    getAllTcs,
    signUpTc,
    signinTc,
    tcAccessRefershToken,
    tcGoogleAuth,
} from "@/controllers/turf-auth.controllers";

import { verifyTc } from "@/middlewares/auth.middleware";
import { Router } from "express";
import passport from "passport";

const router = Router();

// AUTHENTICATIONS ROUTE
router.route('/sign-in').post(signinTc)
router.route('/sign-up').post(signUpTc)
router.route('/refresh-token').post(tcAccessRefershToken)
router.route('/google').get(passport.authenticate('google', { scope: ["profile", "email"] }))
router.route('/google/callback').get(passport.authenticate('google', { session: false }), tcGoogleAuth)

// SET-UP TURF ACCOUNT FOR TURF CAPTAIN
router.route('/:turfCaptainId/create-turf').post(createTurf)

// GET ALL TCs FOR DEV PURPOSE
router.route("/get-all-tcs").get(getAllTcs)

// EDIT TC ACCOUNT
router.route('/edit/:id').patch(editc)



export default router