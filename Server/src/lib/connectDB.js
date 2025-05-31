import mongoose from "mongoose";

const connectDB = async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_CONNECTION_URL);
        console.log("Database connected.....");
    }
    catch(err){
        console.log("Error while connecting to the database:", err);
    }
};

export default connectDB;