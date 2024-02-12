import { Router } from "express";
import passport from "passport";
import {
    googleAuth,
    signUpUser,
    signinUser
} from "@/controllers/user.controllers";

const router = Router();
// APIs END-POINTS
router.route('/sign-in').post(signinUser)
router.route('/sign-up').post(signUpUser)
router.route('/google').get(passport.authenticate('google', { scope: ["profile", "email"] }))
router.route('/google/callback').get(passport.authenticate('google', { session: false }), googleAuth)

export default router;