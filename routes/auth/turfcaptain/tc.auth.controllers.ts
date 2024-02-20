import { verifyTc } from "@/middlewares/auth.middleware";
import { Router } from "express";
import passport from "passport";
import { signUpTc, signinTc, tcAccessRefershToken, tcGoogleAuth } from "./tc.services";

const router = Router();

// AUTHENTICATIONS ROUTE
router.post('/sign-in', signinTc)
router.post('/sign-up', signUpTc)
router.post('/refresh-token', tcAccessRefershToken)

// GOOGLE AUTH
router.get('/google', passport.authenticate('google', { scope: ["profile", "email"] }))
router.get('/google/callback', passport.authenticate('google', { session: false }), tcGoogleAuth)

export default router.use('/tc', router);