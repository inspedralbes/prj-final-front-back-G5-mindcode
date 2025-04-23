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
import { testConnection, connectMongo } from './utils.js';
import { sequelize } from "./models/index.js";
import Message from "./schemes/mongoScheme.js"

dotenv.config();

const serviceaccount = JSON.parse(
    fs.readFileSync("./serviceaccount.json", "utf-8")
);

admin.initializeApp({
    credential: admin.credential.cert(serviceaccount),
});


const app = express();

app.use(cors({
    origin: "*",
    methods: "GET,POST,PUT,DELETE",
    credentials: true
}));


const port = process.env.PORT;

app.use(express.json());

app.use("/api/language", languageRoutes);
app.use("/api/class", classRoutes);
app.use("/api/auth/google", googleRoutes);
app.use("/message", aiRoutes);
app.use("/api/stats", statsRoutes);

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
