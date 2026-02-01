import express from 'express';

const courseRouter = express.Router();

courseRouter.get('/', (req, res) => {
    res.send('Course route is working!');
});

export default courseRouter;