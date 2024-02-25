import { NextFunction, RequestHandler, Router } from "express";
import { signUpUser, signInUser, userAccessRefershToken } from "./user.services";
import passport from "passport";
import { Role, roles } from "@/services/auth.utils";
import { userGoogleCB } from "@/routes/auth/auth.services";
import { initializeRole, tcRole, userRole } from "@/middlewares/middleware";
import { RoleRequest } from "@/utils/static/types";
import { upload } from "@/middlewares/multer.middleware";

const router = Router();
// initializeRole(router, 'user')


router.post('/sign-in', signInUser)
router.post('/sign-up', upload.single('avatar'), signUpUser)
router.post('/refresh-token', userAccessRefershToken)

// GOOGLE AUTH
router.get('/google',
    passport.authenticate('user-google', { scope: ["profile", "email"] })
)

router.get(`/google/callback`, passport.authenticate(`user-google`, { session: false }), userGoogleCB)

export default router.use('/user', router);