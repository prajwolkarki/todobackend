const mongoose = require('mongoose');
require('dotenv').config();


const connectToDatabase = async () =>{

    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connection to database successfully');

    }catch(e){
        console.error('Failed to connect to MongoDB', e);
        process.exit(1);
    }
}

module.exports = connectToDatabase;