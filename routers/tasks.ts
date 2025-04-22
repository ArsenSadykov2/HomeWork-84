import express from "express";
import mongoose from "mongoose";
import User from "../models/User";
import Task from "../models/Task";

const tasksRouter = express.Router();

tasksRouter.post('/', async (req, res, next) => {
    try {
        const token = req.get('Authorization');

        if (!token) {
            res.status(401).send({ error: 'Authorization token required' });
            return;
        }

        const user = await User.findOne({token: token });
        if (!user) {
            res.status(401).send({ error: 'User not found' });
            return;
        }

        const task = new Task({
            user: user._id,
            title: req.body.title,
            description: req.body.description,
            status: req.body.status,
            token: token,
        });

        await task.save();

        res.status(201).send({
            message: 'Task saved successfully',
            task
        });
        return;
    } catch (error) {
        next(error);
    }
});

export default tasksRouter;