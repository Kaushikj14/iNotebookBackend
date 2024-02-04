const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');

// create a user using POST "/api/auth/createuser".Doesn't require authentication(No login required)
router.post('/createuser', [
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
            user = await User.create({
                name: req.body.name,
                password: req.body.password,
                email: req.body.email,
            });
        }
        res.json(user)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Soome error occured")
    }
});


module.exports = router;