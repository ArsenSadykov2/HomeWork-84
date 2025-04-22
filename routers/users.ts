import express from "express";
import {Error} from 'mongoose';
import User from "../models/User";

const usersRouter = express.Router();

usersRouter.post('/', async (req, res, next) => {
    try{
        const user = new User({
            username: req.body.username,
            password: req.body.password,
        });
        user.generateToken();
        await user.save();
        res.send(user);

    }catch(error){
        if(error instanceof Error.ValidationError){
            res.status(400).send({error: error.message});
            return;
        }

        next(error);
    }
});

usersRouter.post('/sessions', async (req, res, next) => {
    if(!req.body.username || !req.body.password){
        res.status(400).send({error: 'Please enter username and password'});
    }

    const user = await User.findOne({username: req.body.username});

    if(!user) {
        res.status(404).send({error: 'Username not found'});
        return;
    }

    const isMath = await user.checkPassword(req.body.password);

    if(!isMath) {
        res.status(400).send({error: 'Invalid username or password'});
        return;
    }

    user.generateToken();
    await user.save();

    res.send({message: "Username and password is correct", user});
});


export default usersRouter;