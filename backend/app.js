// server/app.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./utils/db.js";
import userRoutes from "./routes/user.js";
import rescueRoutes from "./routes/rescue.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// connect db
await connectDB(process.env.MONGO_URI || "mongodb://localhost:27017/cuuho");

// api routes
app.use("/api/users", userRoutes);
app.use("/api/rescue", rescueRoutes);

// serve static frontend
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "..", "public")));

app.get("/api/ping", (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
export default app;