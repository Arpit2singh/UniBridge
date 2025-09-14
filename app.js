import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/routes.js";
import { fileURLToPath } from "url";
import path from "path";

dotenv.config({ path: "./.env" });

const app = express();

const _fileName = fileURLToPath(import.meta.url);
const _dirName = path.dirname(_fileName);

app.use(
  cors({
    origin: process.env.CORS, 
    credentials: true,       
  })
);

// Middlewares
app.use(cookieParser());
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ extended: true, limit: "40kb" }));

// Serve static files
app.use(express.static(path.join(_dirName, "public")));

// Routes
app.use("/api1/v1/UniBridge", userRoutes);

// 404 page
app.use((req, res) => {
  res.status(404).sendFile(path.join(_dirName, "public", "error404.html"));
});

// Start server
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

export default app;
