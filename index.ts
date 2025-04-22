import mongoose from 'mongoose';
import express from "express";
import cors from "cors";
import usersRouter from "./routers/users";
import tasksRouter from "./routers/tasks";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.static('public'));
app.use(express.json());
app.use('/users', usersRouter);
app.use('/tasks', tasksRouter);


const run = async () => {
    await mongoose.connect('mongodb://localhost/homework-84');

    app.listen(port, () => {
        console.log(`Server started on http://localhost:${port}`);
    });

    process.on('exit', () => {
        mongoose.disconnect();
    });
};

run().catch(console.error);

