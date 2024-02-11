const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchUser = require('../middleware/fetchUser');

const JWT_SECRET = 'harryisagoodb&oy';

// ROUTE_1:- create a user using POST "/api/auth/createuser".Doesn't require authentication(No login required)
router.post('/createuser',
    // which data should be passed when user creates the request.
    [
        body('name', 'Enter a Valid Name').isLength({ min: 3 }),
        body('email', 'Enter a Valid Email').isEmail(),
        body('password', 'Enter a Valid Password').isLength({ min: 5 }),


    ], async (req, res) => {
        // If there are errors return bad request and errors
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.send({ errors: result.array() });
        }
        try {
            // check wheather user exists with same email
            let user = await User.findOne({ email: req.body.email });
            if (user) {
                return res.status(400).json({ errors: "Sorry user already exists with same email ID" })
            }
            else {
                // secured password
                const salt = await bcrypt.genSalt(10);
                const secPass = await bcrypt.hash(req.body.password, salt);
                // create a new user
                user = await User.create({
                    name: req.body.name,
                    password: secPass,
                    email: req.body.email,
                });
            }

            const data = {
                user: {
                    id: user.id
                }
            }
            const authToken = jwt.sign(data, JWT_SECRET);
            // console.log(jwtdata);
            res.json({ authToken })
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Soome error occured")
        }
    });

//ROUTE_2 Authenticate a user .No login required
router.post('/login', 
    [
        body('email', 'Enter a valid email').isEmail(),
        body('password', 'Enter a password').exists(),
    ], async (req, res) => {
    // If there are errors then send the bad request and error message
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Please try to login with correct credentials" });
        }


        // bcrypt.compare is a async function so we have to add await else we will get the error
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            return res.status(400).json({ error: "Please try to login with correct credentials" });
        }

        // data of the user which we will be sendings
        const payload = {
            user: {
                id: user.id,
            }
        }

        const authToken = jwt.sign(payload, JWT_SECRET);
        res.json({ authToken })

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server  error occured");
    }


    });


    // ROUTE_3 Get loggedin user details using POST "api/auth/getuser". login required.
    router.post('/getuser',fetchUser,async (req,res)=>{
        try{
            userId = req.user.id;

            const user = await User.findById(userId).select("-password");
            res.send(user)
    
        }catch(error){
            console.error(error.message);
            res.status(500).send("Internal server error");
        }
    })
    

module.exports = router;