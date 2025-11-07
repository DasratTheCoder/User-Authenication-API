import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";
const connect_DB = async () => {
    try {
        const connectInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`The mongodb has been connected successfully on host:${connectInstance.connection.host}`)
    } catch (error) {
        console.log(`The mongodb has not been connected successfully, error ${error}`)
        process.exit(1)
    }
}


export {
    connect_DB
}