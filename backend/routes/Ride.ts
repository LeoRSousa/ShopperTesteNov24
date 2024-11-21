import express, { Request, Response } from "express";
import RideController from "../controllers/RideController";

const router = express.Router();
const ride = new RideController();

router.route('/test').get((req: Request, res: Response) => RideController.test(req, res));
router.route('/estimate').post(/*RideContoller.estimate*/);

export = router;