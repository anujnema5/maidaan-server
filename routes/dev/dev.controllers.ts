import { Router } from "express";
import { getAllBookings, getAllTcs, getAllTurfs, getAllusers, getUserBooking } from "./dev.services";
import { upload } from "@/middlewares/multer.middleware";
import { uploadOnCloudinary } from "@/services/cloudinary.utils";

const router = Router()

router.get('/get-all-users', getAllusers)

// DEV PURPOSE (NO PRODUCTION ROLL-OUT)
router.get('/:userId/get-user-bookings', getUserBooking);
router.get("/get-all-users-with-bookings");

// GET ALL TURF CAPTAINS FOR DEV PURPOSE
router.get("/get-all-tcs", getAllTcs);
router.get("/get-all-turfs", getAllTurfs);
router.get("/get-all-bookings", getAllBookings);

router.post('/test-upload', upload.array("turf"), async (req, res) => {
    const files = req.files as Express.Multer.File[];

    const uploadedFiles = await Promise.all(
        files.map(async (file: Express.Multer.File) => {
           const res =  await uploadOnCloudinary(file.path);
            return res
        })
    );

    console.log(uploadedFiles);
    res.json(uploadedFiles);
});

export default router.use('/dev', router)