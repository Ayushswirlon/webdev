import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    ); //responsible for connectinng to database
    console.log(
      `\n MongoDB connected ! DB host :${connectionInstance.connection.host}` //logging the database host
    );
  } catch (error) {
    console.log("MongoDB Connection Error", error);
    process.exit(1); //error handling
  }
};

export default connectDB;
