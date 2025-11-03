import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./utils/db.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import rescueRoutes from "./routes/rescue.js";
import reportsRoutes from "./routes/reports.js";

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
try {
    await connectDB(process.env.MONGO_URI || "mongodb://localhost:27017/cuuho");
    console.log('Connected to MongoDB');
} catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
}

// Security middleware
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

app.use(helmet());
app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
}));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/rescue", rescueRoutes);
app.use("/api/reports", reportsRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        error: 'Lỗi máy chủ',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Serve static frontend
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "..", "frontend")));

// Health check endpoint
app.get("/api/ping", (req, res) => res.json({ ok: true }));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

export default app;