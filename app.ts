import express, { Application } from "express";
import routes from "@/routes/routes";

// MIDDLEWARE
import initializeMiddlewares from "@/middlewares/middleware";

// OUR EXPRESS APP INSTANCE
const app: Application = express();
initializeMiddlewares(app)

// ROUTES IMPORT
app.use(routes)

// SAMPLE API TEST
app.get('/', (req, res) => {
    return res.send("🏏 Welcome to the TURF SERVER, Your server is running successfully!! ⚽");
})

export { app }