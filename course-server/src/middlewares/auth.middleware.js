import jwt from 'jsonwebtoken';

const generateToken = (req, res) => {
    const { id, email, role } = req.user;

    const accessToken = jwt.sign(
        { id, email, role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
    )

    const refreshToken = jwt.sign(
        { id, email, role },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
    )

    return res.status(200).json({
        accessToken,
        refreshToken
    })
}

const refreshToken = (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh Token is required' });
    }

    try {
        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
        );

        const newAccessToken = jwt.sign(
            { id: decoded.id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
        );

        return res.status(200).json({
            accessToken: newAccessToken
        });
    } catch (error) {
        return res.status(403).json({ message: 'Invalid or expired refresh token' });
    }
};

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized (CREATE USER)' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();

    } catch (error) {
        return res.status(401).json({ message: 'Invalid Token SSS' });
    }
};


export {
    generateToken,
    refreshToken,
    verifyToken
}