import mongoose from "mongoose";

export interface UserFields {
    username: string;
    password: string;
    token: string;
}

export interface User {
    user: mongoose.Schema.Types.ObjectId;
    title: string;
    description: string;
    status: string;
    token: string;
}