const mongoose = require("mongoose");


const NotesSchema = mongoose.Schema({
    user:{
        // it will perform operations same as foreign key   
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    tag:{
        type:String,
        default:"General"
    },
    date:{
        type:Date,
        default:Date.now
    }
})


module.exports = mongoose.model('notes',NotesSchema);