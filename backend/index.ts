import express, { Express, Request, Response } from "express";

const app: Express = express();
const port = 8000;

app.use(express.json());
// app.use(express.urlencoded({ extended: false })); //N sei pra que é

app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server");
});

import RideRouter from './routes/Ride';
app.use('/ride', RideRouter);

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});