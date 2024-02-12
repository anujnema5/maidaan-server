import express, { Application, Request, Response } from "express";

// MIDDLEWARE
import appMiddlewares from "./middlewares/middleware";

// OUR EXPRESS APP INSTANCE
const app: Application = express();
appMiddlewares(app)

// ROUTES IMPORT
import userRoutes from '@/routes/user.routes'
import turfRoutes from '@/routes/turf.routes'
import { verifyJWT } from "./middlewares/auth.middleware";

app.use('/v1/auth/user', userRoutes)
app.use('/v1/auth/turf', turfRoutes)

app.get('/success', verifyJWT, (req, res)=> {
    res.send("Heyyyyy")
})

// SAMPLE API TEST
app.get('/', (req, res) => {
    return res.send("🏏 Welcome to the TURF SERVER, Your server is running successfully!! ⚽");
})

export { app }