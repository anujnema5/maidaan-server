import { signUpTc, signinTc, tcAccessRefershToken, tcGoogleAuth } from "@/controllers/turf.controllers";
import { verifyTc } from "@/middlewares/auth.middleware";
import { Router } from "express";
import passport from "passport";

const router = Router();

router.route('/sign-in').post(signinTc)
router.route('/sign-up').post(signUpTc)
router.route('/google').get(passport.authenticate('google', { scope: ["profile", "email"] }))
router.route('/google/callback').get(passport.authenticate('google', { session: false }), tcGoogleAuth)

export default router