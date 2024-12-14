const express = require('express');
const router = express.Router();
const User = require('../models/User');
const {body, validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const JWT_SECRET = 'putyourmoneytowork';
var fetchuser = require('../middleware/fetchuser');
const nodemailer = require('nodemailer');
const Verification = require('../models/Verification');


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL,
        pass: process.env.PASS,
    },
});

// send otp
router.post('/sendotp', async (req, res) => {
    let success = false;
    const { email } = req.body;
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    const mailOptions = {
        from: '"FinSage" <no-reply@gmail.com>',
        to: email,
        subject: 'FinSage Email Verification Code',
        text: `Your verification code is: ${code}`,
    }

    try {
        let user = await User.findOne({ email: email });
        if (user) {
            return res.status(400).json({success, error: "Sorry a user with this email already exists" })
        }
        const verify = Verification({
            email,
            code
        })
        await verify.save();
        await transporter.sendMail(mailOptions);
        success = true
        res.json({ success });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Error sending email' });
    }
});


//CREATE user
router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be at least 3 chars').isLength({ min: 3 })
] , async (req, res)=>{

    const { name, email, password, code } = req.body;

    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
    }

    try {
        let user = await User.findOne({ email: email });
        if (user) {
            return res.status(400).json({success, error: "Sorry a user with this email already exists" })
        }

        const verificationEntry = await Verification.findOne({ email: email });
        if (!verificationEntry) {
            return res.status(400).json({ success, error: "Verification code not found for this email" });
        }
        // Compare the codes
        if (verificationEntry.code !== code) {
            console.log("Verification failed: Codes do not match");
            return res.status(400).json({ success, error: "Invalid verification code" });
        }
        await Verification.deleteOne({ email: email });

        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(password, salt);
        user = User.create({
            name: name,
            email: email,
            password: secPass
        })

        const data = {
            user:{ id: user.id}
        }
        const authtoken = jwt.sign(data, JWT_SECRET);
        success = true
        res.json({success, authtoken});
    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'server error'});
    }
});

// LOGIN
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be empty').exists()
] , async (req, res)=>{

    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
    }

    const {email, password} = req.body;

    try {
        let user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({success, error: "Please check your login credentials" })
        }

        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            return res.status(400).json({success, error: "Please check your login credentials" })
        }

        const data = {
            user:{ id: user.id}
        }
        const authtoken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({success, authtoken});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});


router.post('/getuser', fetchuser, async (req, res)=>{

    try {
        var userID = req.user.id;
        const user = await User.findById(userID).select("-password");
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router