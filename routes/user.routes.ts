import { Router } from "express";
import passport from "passport";
import {
    getAllusers,
    googleAuth,
    signUpUser,
    signinUser,
    userAccessRefershToken
} from "@/controllers/user.controllers";

const router = Router();

router.route("/get-all-users").get(getAllusers)

// CREDENTIALS SIGN-IN/UP
router.route('/sign-in').post(signinUser)
router.route('/sign-up').post(signUpUser)
router.route('/refresh-token').post(userAccessRefershToken)

// GOOGLE PROVIDERS SIGN-IN/UP
router.route('/google').get(passport.authenticate('google', { scope: ["profile", "email"] }))
router.route('/google/callback').get(passport.authenticate('google', { session: false }), googleAuth)

// EDIT USER APIs

// ACCOUNT SETUP 

// FORGET & UPDATE PASSWORD 

// PHONE NUMBER SIGN-IN/UP 

export default router;