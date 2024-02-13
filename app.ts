import express, { Application } from "express";

// MIDDLEWARE
import initializeMiddlewares from "@/middlewares/middleware";

// OUR EXPRESS APP INSTANCE
const app: Application = express();
initializeMiddlewares(app)

// ROUTES IMPORT
import userRoutes from '@/routes/user.routes'
import turfRoutes from '@/routes/turf.routes'
import { getAllBookings } from "./controllers/booking.controllers";

app.use('/v1/user', userRoutes)
app.use('/v1/turf', turfRoutes)
app.get('/v1/bookings', getAllBookings)

// SAMPLE API TEST
app.get('/', (req, res) => {
    return res.send("🏏 Welcome to the TURF SERVER, Your server is running successfully!! ⚽");
})

export { app }