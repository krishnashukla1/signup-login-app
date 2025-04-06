const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());  

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err));

app.use('/api/auth', authRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


/*
http://localhost:5000/api/auth/signup
{
  "email": "shukla@gmail.com",
  "password": "shukla123"       // password should 8-15 character and one number one capital one small one special character
}

signup success

-----------------------------
http://localhost:5000/api/auth/login

{
  "email": "shukla@gmail.com",
  "password": "shukla123"
}
---
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MmI0YjIxMTE1ZGZkMDBkYTliMzcwOSIsImlhdCI6MTczMDg5MDY5NywiZXhwIjoxNzMwODk0Mjk3fQ.5YTmwXXo8s9uCQp9cNgq04P6-sf8Wnd5dZL5iGJZsUY",
  "loginTime": "2024-11-06T10:58:17.862Z"
}
*/