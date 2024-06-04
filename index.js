import express from 'express';
import ConnectToDatabase from './db.js';
import router from './routes/productRoute.js';
import dotenv from "dotenv";
import cors from 'cors';

const app = express();
const port = 4000;
dotenv.config();

ConnectToDatabase();

app.use(cors());

app.use('/api',router);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Server Running At Port http://localhost:4000/`)
});

