import mongoose from "mongoose";
import config from "./config";
import User from "./models/User";
import Task from "./models/Task";


const run = async () => {
    await mongoose.connect(config.db);
    const db = mongoose.connection;

    try{
        await db.dropCollection("tasks");
        await db.dropCollection("users");
    }catch(err){
        console.log('Collections are not present');
    }

    const [firstUser, secondUser] = await User.create(
        {
            username: "John",
            password: '123456',
            token: crypto.randomUUID()
        },
        {
            username: "Selena",
            password: '123456',
            token: crypto.randomUUID()
        }
    )

    await Task.create(
        {
            user: firstUser._id,
            title: '12312',
            description: '123456',
            status: 'new',
            token: crypto.randomUUID()
        },
        {
            user: secondUser._id,
            title: '123123',
            description: '123456',
            status: 'new',
            token: crypto.randomUUID()
        }
    )


    await db.close();
};

run().catch(console.error);