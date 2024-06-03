import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();
const ConnectString = process.env.CONNECTION_STRING;

const ConnectToDatabase = async () =>{
    try {
        await mongoose.connect(ConnectString);
        console.log("Connected To Database");
    } catch (error) {
        console.log('Failed To Connect To Database');
    }
}

export default ConnectToDatabase;