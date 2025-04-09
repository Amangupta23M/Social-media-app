import mongoose from "mongoose";
// import {DB_NAME} from '../constants.js';


const connectDB=async()=>{
    try{
        const connectionInstance= await mongoose.connect(`${process.env.MONGODB_URI}`)
        // console.log(connectionInstance)
        console.log(`MongoDB connected: ${connectionInstance.connection.host}`);
    }catch(err){
        console.error("MongoDB connection Error:",err);
        //thorw err
        process.exit(1);
    }
}

export default connectDB;