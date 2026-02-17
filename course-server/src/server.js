import express from 'express';
import dotenv from 'dotenv'
import cors from 'cors'
import router from './routes/index.js'
import * as cf from './config/index.js'
import morgan from 'morgan';

const app = express();
dotenv.config()

const port = process.env.PORT || 3003;

cf.connectDB()
cf.connectCloudinary()

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ origin: '*', credentials: true }))

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

router(app)

app.get('/', (req, res) => {
    res.send('This is the Online Course System server.');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});