import express from 'express';
import route from './routes/index.js';
import dotenv from 'dotenv'

const app = express();
dotenv.config()

const port = process.env.PORT || 3003;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

route(app);

app.get('/', (req, res) => {
    res.send('This is the Online Course System server.');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});