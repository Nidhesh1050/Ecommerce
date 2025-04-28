const User = require('../model/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET_TOKEN


exports.register = async (req, res) => {
    const { name, email, role, passwordHash } = req.body;
    const hashedPassword = await bcrypt.hash(passwordHash, 10);

    try {

      const existingUser = await User.findOne({ email });
      if (existingUser) {
          return res.status(200).json({ message: 'User already exists',user:[] });
      }

        const registerData = await User.create({
            name,
            email,
            role,
            passwordHash: hashedPassword,
        });
        res.status(200).json({ message: "Register successful", user:registerData });
    } catch (error) {
        res.status(500).json({ error: 'User not register, server error' });
    }
};

exports.login = async (req, res) => {
    const { email, passwordHash } = req.body;
    try {
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const isPasswordValid = await bcrypt.compare(passwordHash, user.passwordHash);
  
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid password" });
      }
  
      const userData = {
        userId: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      };
      const token = jwt.sign(userData, SECRET_KEY, { expiresIn: '7d' });
  
      res.status(200).json({ message: "Login successful", user:userData, token });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Server error during login" });
    }
};

exports.profile = async (req, res) => {
    try {
        const users = await User.find();
        
        const userData = users.map(user => ({
            name: user.name,
            email: user.email,
            role: user.role
          }));

        res.status(200).json({ message: 'Profile data fetched successfully', userData });
    } catch (error) {
        res.status(500).json({ error: 'Users not get, server error' });
    }
};