import {
    editTurf,
    getAllTcs,
    signUpTc,
    signinTc,
    tcAccessRefershToken,
    tcGoogleAuth
} from "@/controllers/turf.controllers";

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

// GET ALL TCs
router.route("/get-all-tcs").get(getAllTcs)

// EDIT TC ACCOUNT
router.route('/edit/:id').patch(editTurf)


// SET-UP ACCOUNT



export default router