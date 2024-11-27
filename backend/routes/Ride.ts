import express, { Request, Response } from "express";
const router = express.Router();
const ride = require('../controllers/RideController');

router.route('/estimate').post(ride.estimate);
router.route('/confirm').patch(ride.confirm);
router.route('/:customer_id').get(ride.getRidesByIds);
router.route('/').get(ride.getRidesByIds);

export = router;