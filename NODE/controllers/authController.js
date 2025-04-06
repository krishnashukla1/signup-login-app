const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');  

// Signup Controller
const signup = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Validate email using validator
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        // Validate password
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,15}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                message: 'Password must be 8-15 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
            });
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
        res.status(201).json({ message: 'Signup successful, user added to database' , token });
        // res.status(201).json({ message: 'Signup successful, user added to database'});
        console.log('Signup successful, user added to database');
        

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
        console.log('Login successful');
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { signup, login };
