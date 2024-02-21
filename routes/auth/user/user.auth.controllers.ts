import { NextFunction, RequestHandler, Router } from "express";
import { signUpUser, signInUser, userAccessRefershToken } from "./user.services";
import passport from "passport";
import { Role, roles } from "@/services/auth.utils";
import { googleAuth } from "@/routes/auth/auth.services";
import { initializeRole } from "@/middlewares/middleware";

const router = Router();
initializeRole(router, Role.user)

// CREDENTIALS AUTH
router.post('/sign-in', signInUser)
router.post('/sign-up', signUpUser)
router.post('/refresh-token', userAccessRefershToken)

// GOOGLE AUTH
router.get('/google',
    passport.authenticate('google', { scope: ["profile", "email"] })
)

export default router.use('/user', router);