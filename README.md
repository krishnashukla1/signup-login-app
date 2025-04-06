# 🔐 MERN Authentication App (Signup & Login)

This is a simple **Node.js + Express + MongoDB backend** with **React + Vite frontend** for user **authentication using JWT**. It supports:

- ✅ User signup with email & strong password validations
- 🔐 Secure login with hashed password check
- 🔑 JWT token generation for authentication
- 🔒 Password encryption using bcrypt

---

## 🚀 Backend API

### ✅ Signup
----
Sample API call--

Signup:
POST http://localhost:5000/api/auth/signup

Body:
{
  "email": "shukla@gmail.com",
  "password": "Shukla@123" // Password must be 8-15 chars with one uppercase, lowercase, number, and special char
}

Login:
POST http://localhost:5000/api/auth/login

Body:
{
  "email": "shukla@gmail.com",
  "password": "Shukla@123"
}

Expected Response:
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9....",
  "loginTime": "2024-11-06T10:58:17.862Z"
}


**Endpoint:**

