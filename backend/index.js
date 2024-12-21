import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
dotenv.config({});

const app = express();

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // parsing the token stored in the cookies
const corsOptions = {
  origin: "https//localhost:5173",
  credentials: true,
};
app.use(cors(corsOptions));

const PORT = process.env.PORT || 8080;

//Route
app.use("/api/v1/user", userRoute);

//server
app.listen(PORT, () => {
  connectDB();
  console.log(`server running on port ${PORT}`);
});
