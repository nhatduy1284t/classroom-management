import mongoose from 'mongoose';

async function connect() {
    try {
        await mongoose.connect('mongodb://localhost:27017/classroommanagement');
        console.log('Connect successfully!!!'); 
    } catch (error) {
        console.log('Connect failure!!!');
    }
}

export default connect;
