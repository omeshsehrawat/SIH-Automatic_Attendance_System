import mongoose from "mongoose";

const connectDB = async() => {
    try {
        const conn = await mongoose.connect(process.env.DB_URL)
        console.log("connected to DB")
    } catch (error) {
        console.log("connot connect DB",error);
        process.exit(1)
    }
}

export {connectDB};