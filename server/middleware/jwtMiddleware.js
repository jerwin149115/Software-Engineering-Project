const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }
    
    try {
        const decoded = jwt.verify(token, 'wow');
        const user = await User.findById(decoded.id); 
        
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized: User not found' });
        }

        req.user = {
            teamId: user._id,
            username: user.username,
        };

        next();
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(401).json({ message: 'Unauthorized: Token verification failed' });
    }
};

module.exports = auth;
