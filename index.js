import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import emailRoutes from './routes/email.js';

/* CONFIG */
const app = express();
/* USE ENV FILES */
dotenv.config();
/* USE JSON REQUESTS */
app.use(express.json());
/* CORS RULES */
app.use(cors({
    origin: '*', // Allow All Origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed Methods
}));
app.options('*', cors()); // Response all OPTIONS Requests
/* GET THE DIRECTORY */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
/* DEFINE THIS DIRECTORY TO BE PUBLIC FOR USERS */
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

/* ROUTES */
app.get("/", (req, res) => res.status(200).json({ status: 200, msg: "Hello World!" }));
app.post("/", (req, res) => res.status(200).json({ status: 200, msg: "Hello World!" }));
app.use('/email', emailRoutes);

/* MONGOOSE SETUP */
/* Server PORT */
const port = process.env.PORT || 3000;
/* CONNECT DATABASE */
mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("Database Connected");
    }).catch((err) => {
        console.log(err)
    })

/* VERCEL SERVER START */
export default app;
console.log(`App Started`);  