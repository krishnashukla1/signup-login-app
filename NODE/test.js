const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');

dotenv.config();

const app = express();
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('MongoDB connected');
}).catch((error) => {
    console.error('MongoDB connection error:', error);
});

// Use authentication routes
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});




/*
http://localhost:5000/api/auth/signup
{
  "email": "user@example.com",
  "password": "yourpassword"
}


{"message":"User created successfully","token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MmI0MmQ1NmEyYjE2ZWI3MzAxMzAwNSIsImlhdCI6MTczMDg4ODQwNSwiZXhwIjoxNzMwODkyMDA1fQ.3MCaGbbUKoSAl6FROx3Mi2bEUkIvW5BG1QzVHtB4H38"}

in mongodb database also showing


_id
672b42d56a2b16eb73013005
email
"krishna@gmail.com"
password
"$2a$10$ogLBQTkbdjREp66LPTsCReD2cLhDvjZLyXMhfRugLa8jKJwaHs6IC"
__v
0
=============================================
  ------------
http://localhost:5000/api/auth/login

{
  "email": "krishna@gmail.com",
  "password": "pass123"
}


{"message":"Login successful","token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MmI0MmQ1NmEyYjE2ZWI3MzAxMzAwNSIsImlhdCI6MTczMDg4ODUyOSwiZXhwIjoxNzMwODkyMTI5fQ.a15xa6B0mRWK-FQaC1kb6MMYrFiJqu7slc-ZxJHxUS8"}

*/
//----------------------------------------------------------------------------------------

/*
==>   If you want validate password in simple way
   
npm install password-validator

authController.js-->

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passwordValidator = require('password-validator');

// Create a password schema
const passwordSchema = new passwordValidator();

// Add password rules: 8-15 characters, 1 lowercase, 1 uppercase, 1 digit, 1 special character
passwordSchema
  .is().min(8)                                    // Minimum length 8
  .is().max(15)                                   // Maximum length 15
  .has().lowercase()                              // Must have a lowercase letter
  .has().uppercase()                              // Must have an uppercase letter
  .has().digits()                                 // Must have a digit
  .has().symbols()                                // Must have a special character
  .has().not().spaces();                          // Should not have spaces

// Signup Controller
const signup = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Validate email using built-in method
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        // Validate password using password schema
        if (!passwordSchema.validate(password)) {
            return res.status(400).json({ message: 'Password must be 8-15 characters long, with 1 uppercase, 1 lowercase, 1 digit, and 1 special character' });
        }

        // Check if the user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password before saving the user
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const user = new User({
            email,
            password: hashedPassword,
        });

        // Save the user to the database
        await user.save();

        // Generate a JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Send response with success message and token
        res.status(201).json({ message: 'Signup successful', token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Login Controller
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Compare the entered password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Get the current login time
        const loginTime = new Date().toISOString();

        // Send response with success message, token, and login time
        res.status(200).json({ message: 'Login successful', token, loginTime });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
npm install password-validator

module.exports = { signup, login };

*/