import { Router } from "express";
import userAuth from '@/routes/auth/user/user.auth.controllers'
import turfCaptainAuth from '@/routes/auth/turfcaptain/tc.auth.controllers'
import passport from "passport";
import { googleAuth } from "./auth.services";

const auth = Router()
    .use(userAuth)
    .use(turfCaptainAuth)
    .get(`/google/callback`,
        passport.authenticate('google', { session: false }), googleAuth
    )

export default auth.use('/auth', auth)