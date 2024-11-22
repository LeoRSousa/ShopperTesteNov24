import express, { Request, Response } from "express";
const router = express.Router();
const ride = require('../controllers/RideController');

router.route('/test').get(ride.test);
router.route('/estimate').post(/*RideContoller.estimate*/);

export = router;