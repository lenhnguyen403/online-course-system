import mongoose from 'mongoose'

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('Connect DB successfully!!!');

    } catch (error) {
        console.error('Connect DB failed!!!!');
        console.error(error);

    }
}

export default connectDB;