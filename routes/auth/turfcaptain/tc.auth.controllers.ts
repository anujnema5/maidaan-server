import { verifyTc } from "@/middlewares/auth.middleware";
import { Router } from "express";
import passport from "passport";
import { signUpTc, signinTc, tcAccessRefershToken } from "./tc.services";
import { tcGoogleCB } from "../auth.services";
import { initializeRole, tcRole } from "@/middlewares/middleware";
import { Role, RoleRequest } from "@/utils/static/types";

const router = Router();
// initializeRole(router, 'tc')

// AUTHENTICATIONS ROUTE
router.post('/sign-in', signinTc)
router.post('/sign-up', signUpTc)
router.post('/refresh-token', tcAccessRefershToken)

// GOOGLE AUTH
router.get('/google',
    passport.authenticate('tc-google', { scope: ["profile", "email"] })
)

router.get(`/google/callback`,
    passport.authenticate(`tc-google`, { session: false }), tcGoogleCB)

export default router.use('/tc', router);