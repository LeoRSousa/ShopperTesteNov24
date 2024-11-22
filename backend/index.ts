import express, { Express, Request, Response } from "express";

const app: Express = express();
const port = 8000;

app.use(express.json());
// app.use(express.urlencoded({ extended: false })); //N sei pra que é

app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server");
});

const rideRouter = require('./routes/Ride');
app.use('/ride', rideRouter);

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});