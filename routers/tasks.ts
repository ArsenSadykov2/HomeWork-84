import express, {Request} from "express";
import mongoose, {HydratedDocument} from "mongoose";
import User from "../models/User";
import Task from "../models/Task";
import {UserFields} from "../types";
import auth from "../middleware/auth";
import mongoDb from "../mongoDb";

const tasksRouter = express.Router();

export interface RequestWith extends Request {
    user: HydratedDocument<UserFields>;
}

tasksRouter.post('/',auth, async (req, res, next) => {
    try {
        const token = req.get('Authorization');

        if (!token) {
            res.status(401).send({ error: 'Authorization token required' });
            return;
        }

        const user = (req as RequestWith).user;
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

tasksRouter.get('/', async (req, res, next) => {
    try {
        const user_id = req.query._id as string;
        const filter: {user?: string} = {};

        if (user_id) filter.user = user_id;

        const tasks = await Task.find(filter);
        res.send({tasks});
    } catch (e) {
        next(e);
    }
});


tasksRouter.delete('/:id',auth, async (req, res, next) => {
    const taskId = req.params.id;
    try {
        const token = req.get('Authorization');

        if (!token) {
            res.status(401).send({ error: 'Authorization token required' });
            return;
        }

        const user = await User.findById({token});
        if (!user) {
            res.status(401).send({ error: 'User not found' });
            return;
        }

        const task = await Task.findOne({ _id: taskId, user: user._id });
        if (!task) {
            res.status(403).send({ error: 'You can delete only your own task' });
            return;
        }

        await Task.deleteOne({ _id: taskId });
        res.send({ message: 'Task deleted successfully' });
        return;

    } catch (error) {
        next(error);
    }
});


export default tasksRouter;