import mongoose from 'mongoose'

const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}/f5-edu-db`)
        console.log('Connect DB successfully!!!');

    } catch (error) {
        console.error('Connect DB failed!!!!');
        console.error(error);

    }
}

export default connectDB;