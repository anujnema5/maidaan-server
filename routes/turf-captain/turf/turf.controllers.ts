import { upload } from "@/middlewares/multer.middleware";
import { Router } from "express";
import { createTurf, deleteImage, getAllTurfs, replaceTurfImage, totalTurfPlays, uploadTurfImages } from "./turf.services";

const router = Router();

router.get("/get-all-turfs", getAllTurfs);

router.post('/register-turf', upload.array("turf"), createTurf);
router.post('/:turfId/upload-images', upload.array("turf"), uploadTurfImages)
router.patch('/:turfImageId/replace-image', upload.single("turf"), replaceTurfImage);
router.delete('/:turfImageId/delete-image', deleteImage);

router.get('/:turfId/total-plays', totalTurfPlays)

export default router;