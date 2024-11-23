const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT;


// Middleware to fetch the user from JWT token
const fetchuser = (req, res, next) => {
    // Get the token from the request header
    const token = req.header('auth-token');
    if (!token) {
        return res.status(401).json({ error: 'Access denied: No token provided' });
    }

    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user; // Attach the user ID to the request
        // console.log(req.user);
        next();
    } catch (error) {
        res.status(401).json({ error: 'Access denied: Invalid token' });
    }
};

module.exports = fetchuser;
