import express, {Request} from "express";
import mongoose, {HydratedDocument} from "mongoose";
import User from "../models/User";
import Task from "../models/Task";
import {UserFields} from "../types";
import auth from "../middleware/auth";

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

tasksRouter.get('/', auth, async (req, res, next) => {
    try {
        const user = (req as RequestWith).user;
        const user_id = req.query._id as string;
        const filter: {user?: string} = {};

        if (user_id) filter.user = user_id;

        const tasks = await Task.find(filter);
        res.send({tasks});
    } catch (e) {
        next(e);
    }
});

tasksRouter.get('/:id', async (req, res, next) => {
    const id = req.params.id;

    try {
        const product = await Task.findById(id);

        if (!product) {
            res.status(404).send({message: 'Product not found'});
            return;
        }

        res.send(product);
    } catch (e) {
        next(e);
    }
});

export default tasksRouter;