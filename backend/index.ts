import express, { Express, Request, Response } from "express";

const cors = require('cors');
const app: Express = express();
const port = 8000;

const connect = require('./database.js');

app.use(express.json());
app.use(cors());
// app.use(express.urlencoded({ extended: false })); //N sei pra que é

app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server");
});

const rideRouter = require('./routes/Ride');
app.use('/ride', rideRouter);

const driveRouter = require('./routes/Drive');
app.use('/driver', driveRouter);

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);

    connect.authenticate()
        .then(() => {
            console.log('Connection has been established successfully.');
        })
        .catch((error: any) => {
            console.error('Unable to connect to the database:', error);
        })
});