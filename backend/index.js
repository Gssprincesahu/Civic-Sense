import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRoute from './route/user.route.js';
import dataRoute from './route/data.route.js';
dotenv.config();
const app = express();

// CORS configuration for credentials
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());
const URL = process.env.MongoDBURL;
const PORT = process.env.PORT || 5001;


const connectDB = async () => {
    try {
        await mongoose.connect(URL);
        console.log("MongoDB connected");
    } catch (error) {
        console.log("MongoDB not connected:", error.message);
    }
};

connectDB();
app.use("/api/user", userRoute);
app.use("/api/issues", dataRoute);

app.listen(PORT,() =>{
    console.log(`Server is running on port ${PORT}`);
})
