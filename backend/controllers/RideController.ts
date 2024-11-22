import { Request, Response } from "express";

function test(req: Request, res: Response): any {
    return res.status(200).json({
        message: 'Success'
    });
}

module.exports = {
    test
};