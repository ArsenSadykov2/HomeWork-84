import mongoose, {HydratedDocument, Model, Schema} from "mongoose";
import {User} from "../types";
import {randomUUID} from "node:crypto";

interface TracksMethod {
    generateToken(): void;
}

type TaskModel = Model<User, {}, TracksMethod>;

const TaskSchema = new mongoose.Schema<
    HydratedDocument<User>,
    TaskModel,
    TracksMethod,
    {}

>({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        ref: "Track",
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        required: true
    }
});

TaskSchema.pre('save', function(next) {
    if (!this.token) {
        this.token = randomUUID();
    }
    next();
});

TaskSchema.methods.generateToken = function () {
    this.token = randomUUID();
}

const TrackHistory = mongoose.model('Task', TaskSchema);
export default TrackHistory;