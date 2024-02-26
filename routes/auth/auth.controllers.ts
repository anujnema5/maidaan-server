import { Request, Router } from "express";
import userAuth from '@/routes/auth/user/user.auth.controllers'
import turfCaptainAuth from '@/routes/auth/turfcaptain/tc.auth.controllers'

const auth = Router()
    .use(userAuth)
    .use(turfCaptainAuth)

export default auth.use('/auth', auth)