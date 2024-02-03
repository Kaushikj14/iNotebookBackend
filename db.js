const mongoose = require('mongoose');
const mongooURI = 'mongodb://localhost:27017/mydb';

const connectToMongo =  ()=>{
    mongoose.connect(mongooURI);
    
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
      console.log('Connected to MongoDB Succesfully');
    });
}


module.exports = connectToMongo;