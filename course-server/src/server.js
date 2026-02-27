// import dotenv from 'dotenv'
// dotenv.config()
// Hoac
import 'dotenv/config';

import 'express-async-errors';
import express from 'express';
import chalk from 'chalk';
import cors from 'cors'
import router from './routes/index.js'
import * as cf from './config/index.js'
import morgan from 'morgan';
import { notFoundMiddleware } from './middlewares/notfound.middleware.js'
import { errorMiddleware } from './middlewares/error.middleware.js'


const app = express();
const port = process.env.PORT || 3003;

cf.connectDB()
cf.connectCloudinary()

app.use(cors(
    {
        origin: 'http://localhost:5173',
        // credentials: true
    }
))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

router(app)

app.get('/', (req, res) => {
    res.send('This is the Online Course System server.');
});

app.use(notFoundMiddleware);
app.use(errorMiddleware);

app.listen(port, () => {
    console.log("=============================================");
    console.log('Server is running on ' + chalk.blueBright.bold.underline(`http://localhost:${port}`));
    console.log("=============================================");
});