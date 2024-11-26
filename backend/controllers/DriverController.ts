import { Request, Response } from "express";
import { Driver } from "../models/Driver";
import { Review } from "../models/Review";
const DriverDB = require('../models_DB/driver');
const ReviewDB = require('../models_DB/review');

export async function driversAndReviews(drivers:any[], reviews: any[]): Promise<any[]> {
    var merged: any[] = [];
    drivers.forEach((driver: Driver) => {
        const match = reviews.find((review: Review) => review.driver_id == driver.driver_id);
        merged.push({
            "driver_id": driver.driver_id,
            "name": driver.name,
            "description": driver.description,
            "vehicle": driver.vehicle,
            "review": {
                "rating": match.rating,
                "comment": match.comment
            },
            "value": driver.value,
            "km": driver.km,
        });
    });
    return merged;
}

async function getDrivers(req: Request, res: Response): Promise<any> {
    const drivers = await DriverDB.findAll({});
    const reviews = await ReviewDB.findAll({});

    const merged = await driversAndReviews(drivers, reviews);

    return res.status(200).json({
        message: 'Success',
        merged
    });
}

module.exports = {
    getDrivers,
    driversAndReviews
};