import { Request, Response } from "express";

class RideController {
    public test(req: Request, res: Response): void {
        res.status(200).json({
            message: 'Success'
        });
    }
}

export = RideController;