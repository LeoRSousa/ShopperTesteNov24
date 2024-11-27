import express, { Request, Response } from "express";
const router = express.Router();
const driver = require('../controllers/DriverController');

router.route('/getAll').get(driver.getDrivers);
router.route('/getOne').get(driver.getDriver);

export = router;