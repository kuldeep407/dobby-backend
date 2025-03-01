import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";

import { connectDB } from "./config/db.js";
import userRoute from "./routes/userRoute.js";
import folderRotue from "./routes/folderRoute.js";
import imageRoute from "./routes/imageRoute.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: [
      "http://localhost:5173",
    ],
    credentials: true,
  })
);

app.use(express.json());

app.use("/uploads", express.static(path.join("uploads")));

app.use(userRoute);
app.use(folderRotue);
app.use(imageRoute);

app.get("/", (req, res) => {
  console.log("Server is running...");
  res.send("WORKING");
});

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
