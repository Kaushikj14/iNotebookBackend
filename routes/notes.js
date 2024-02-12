const express = require('express');
const router = express.Router();
const fetchUser = require('../middleware/fetchUser');
const Note = require('../models/Notes');
const { body, validationResult } = require('express-validator');


// ROUTES_1 :- fetch notes of user which is logged in. GET all the notes
router.get(
    // route
    '/fetchallnotes', 
    // middleware
    fetchUser, 
    // function to be called -> thngs that should be performed
    async (req, res) => {
        try {
            // get all the notes of the the particular user
            const notes = await Note.find({ user: req.user.id });
            res.json(notes);
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal server errorr");
        }


    });


// ROUTES_2 :- Add a new note using POST. LOGIN required
router.post(
    // route url
    '/addnote', 
    // middleware
    fetchUser, 
    // requirements when we hit url
    [
    body('title', 'Enter a Valid title').isLength({ min: 3 }),
    body('description', 'Enter a Valid description, description must be atleat of 5 characters').isLength({ min: 5 }),

    ], 
    // function to be called -> Process to be performed
    async (req, res) => {
    try {
        const { title, description, tag, } = req.body;
        // If there are errors return bad request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array });
        }

        // create a object of Notes Schema and store data in them
        const note = new Note({
            title, description, tag, user: req.user.id,
        })

        const savedNote = await note.save();

        // get all the notes of the the particular user
        // const notes = await Notes.find({ user: req.user.id });
        res.json(savedNote);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server errorr");
    }


});


// ROUTE_3 :- Update an existing note : PUT . LOGIN REQUIRED
router.put(
    '/updatenote/:id',
    fetchUser,
    async (req,res)=>{


        const {title,description,tag} = req.body;
        // create a newNote object
        const newNote = {};
        if(title){newNote.title=title};
        if(description){newNote.description=description};
        if(tag){newNote.tag=tag};

        // check if the user which is updating is in the user account only
        let note = await Note.findById(req.params.id);
        if(!note){
            return res.status(404).send("Not found");
        }
        if(note.user.toString()!==req.user.id){
            return res.status(401).send("Aunthorized - Not allowed");
        }
        
        // find the note to be updated and update it.
        note = await Note.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true});
        res.json({note});
    },
    );

module.exports = router;