import { verifyTc } from "@/middlewares/auth.middleware";
import { Router } from "express";
import passport from "passport";
import { signUpTc, signinTc, tcAccessRefershToken, tcGoogleAuth } from "./tc.services";
import { googleAuth } from "../auth.services";
import { initializeRole } from "@/middlewares/middleware";
import { Role } from "@/utils/static/types";

const router = Router();
initializeRole(router, Role.tc)

// AUTHENTICATIONS ROUTE
router.post('/sign-in', signinTc)
router.post('/sign-up', signUpTc)
router.post('/refresh-token', tcAccessRefershToken)

// GOOGLE AUTH
router.get('/google',
    passport.authenticate('google', { scope: ["profile", "email"] })
)

export default router.use('/tc', router);