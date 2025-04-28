
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_SECRET_TOKEN




const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'] || req.headers['Authorization']; // Check both
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), SECRET_KEY);
        req.auth = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ message: "Forbidden" });
    }
};

module.exports = authenticateToken