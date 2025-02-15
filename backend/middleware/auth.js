const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        req.user = decoded; // Attach user data to the request
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid or expired token." });
    }
};

module.exports = authenticateUser;
