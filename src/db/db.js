import mongoose from 'mongoose';

async function connect() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Connect successfully!!!'); 
    } catch (error) {
        console.log('Connect failure!!!');
    }
}

export default connect;
