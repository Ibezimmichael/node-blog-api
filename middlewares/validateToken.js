const jwt = require('jsonwebtoken');

const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization || req.headers.Authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Missing or invalid Authorization header' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = await jwt.verify(token, process.env.JWT_KEY);

        // Additional validation (if needed):
        // - Check token expiration
        // - Validate audience claim

        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
};

module.exports = authenticateToken;
