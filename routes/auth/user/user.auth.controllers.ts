import { Router } from "express";
import { googleAuth, signUpUser, signInUser, userAccessRefershToken } from "./user.services";
import passport from "passport";

const router = Router();
// router.use('/user/')

// CREDENTIALS AUTH
router.post('/sign-in', signInUser)
router.post('/sign-up', signUpUser)
router.post('/refresh-token', userAccessRefershToken)

// GOOGLE AUTH
router.get('/auth/google', passport.authenticate('google', { scope: ["profile", "email"] }))
router.get('/auth/google/callback', passport.authenticate('google', { session: false }), googleAuth)

export default router.use('/user', router);