import { googleAuth, signIn, signUp } from "@/controllers/turf.controllers";
import { verifyJWT } from "@/middlewares/auth.middleware";
import { Router } from "express";
import passport from "passport";

const router = Router();

router.route('/sign-in').post(signIn)
router.route('/sign-up').post(signUp)
router.route('/google').get(passport.authenticate('google', { scope: ["profile", "email"] }))
router.route('/google/callback').get(passport.authenticate('google', { session: false }), googleAuth)

export default router