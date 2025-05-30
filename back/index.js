import express from 'express';
import dotenv from 'dotenv';
import admin from 'firebase-admin';
import fs from 'fs';
import cors from 'cors';
import languageRoutes from './routes/languageRoutes.js';
import classRoutes from './routes/classRoutes.js';
import googleRoutes from './routes/googleRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import userRoutes from './routes/userRoutes.js';
import restrictionRoutes from './routes/restrictionRoutes.js';
import { testConnection, connectMongo } from './utils.js';
import { sequelize } from "./models/index.js";
import Message from "./schemes/mongoScheme.js"
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const serviceaccount = JSON.parse(
    fs.readFileSync("./serviceaccount.json", "utf-8")
);

admin.initializeApp({
    credential: admin.credential.cert(serviceaccount),
});

// process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const app = express();

app.use(cors("*"));


const port = process.env.PORT;

app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/api/language", languageRoutes);
app.use("/api/class", classRoutes);
app.use("/api/auth/google", googleRoutes);
app.use("/message", aiRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/user", userRoutes);
app.use("/api/restriction", restrictionRoutes);
testConnection();  

connectMongo();

export async function insertBase() {
    const message = new Message({ userContent: 'HOLAHOLAOHLAOHLAOHOGOALHOAOHOGJGHASG', userId: 1, classId: 2, languageId: 3, language: "Python" });
    await message.save();
}

app.get('/', (req, res) => {
    res.send('This is the back end!');
});


sequelize.sync().then(() => {
    console.log("Database synced");
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
});
