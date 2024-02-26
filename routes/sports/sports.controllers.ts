import { Router } from "express";
import { getTurfs } from "./sports.services";

const router = Router();

router.get('/box-cricket', getTurfs('boxcricket'))
router.get('/cricket', getTurfs('cricket'))
router.get('/football', getTurfs('football'))
router.get('/badminton', getTurfs('badminton'))
router.get('/tennis', getTurfs('tennis'));
router.get('/rugby', getTurfs('rugby'))
router.get('/golf', getTurfs('golf'))
router.get('/zumba', getTurfs('zumba'))


export default router.use("/sports", router)