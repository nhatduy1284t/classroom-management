import mongoose from 'mongoose';

async function connect() {
    try {
        await mongoose.connect('mongodb+srv://kietnguyen:12345678%21%40%23@classroommanagement.txdayfp.mongodb.net/?retryWrites=true&w=majority');
        console.log('Connect successfully!!!'); 
    } catch (error) {
        console.log('Connect failure!!!');
    }
}

export default connect;
