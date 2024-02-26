import { Router } from "express";
import authRoute from '@/routes/auth/auth.controllers'
import userRoutes from '@/routes/user/user.controllers'
import turfRoutes from '@/routes/turf-captain/turf-captain.controllers'
import devRoutes from '@/routes/dev/dev.controllers'
import sportsRoutes from '@/routes/sports/sports.controllers'

const api = Router()
    .use(sportsRoutes)
    .use(authRoute)
    .use(userRoutes)
    .use(turfRoutes)
    .use(devRoutes) //DEV PURPOSE ONLY

export default api.use('/api', api)