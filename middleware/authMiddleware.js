const jwt = require('jsonwebtoken');
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || '02c0e3997ebada3dd8f9a4b9195edd55d2c0ce93e5401368b8325727c34466f30a87756a7cea051e73c1ddb82102fbabd3394873125ebc2c173e0c9e56513d49';

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"
    try {
        if (!token) {
            console.log("Token requis : ", req.user);
            return res.status(401).json({ message: 'Token d\'accès requis' });
        }
        
        const decodedToken = jwt.verify(token, JWT_SECRET);
        // console.log(decodedToken);
        
        const user = await User.find({username: decodedToken.username}).select('-password');
        if (!user) {
            return res.status(401).json({ message: 'Token invalide' });
        }
        // console.log(user);
        
        req.user = user;
        next();
    } catch (err) {
        res.status(401).json({ 
            message: 'Erreur lors de la verification de l\'utilisateur',
            error: err
         });
    }
};

module.exports = authenticateToken;