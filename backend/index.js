import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoute from './route/user.route.js';
dotenv.config();
const app = express();
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
const URL = process.env.MongoDBURL;
const PORT = process.env.PORT || 5001;


const connectDB = async () => {
    try {
        await mongoose.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("MongoDB connected");
    } catch (error) {
        console.log("MongoDB not connected:", error.message);
    }
};

connectDB();
app.use("/user",userRoute);

app.listen(PORT,() =>{
    console.log(`Server is running on port ${PORT}`);
})
