const express = require('express')
const router = express.Router();

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');


const JWT_SECRET = '02c0e3997ebada3dd8f9a4b9195edd55d2c0ce93e5401368b8325727c34466f30a87756a7cea051e73c1ddb82102fbabd3394873125ebc2c173e0c9e56513d49';

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"
    try {

        if (!token) {
            return res.status(401).json({ message: 'Token d\'accès requis' });
        }
        
        const decodedToken = jwt.verify(token, JWT_SECRET);

        const user = await User.findById(decodedToken.userId).select('-password');
        if (!user) {
            return res.status(401).json({ message: 'Token is not valid' });
        }
        
        req.user = user;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};


// Inscrire un nouveau user
router.post('/register', async (req, res) => {
    // salt permet d'ajouter des caracteres speciaux aleatoires au moment du hashage
    const salt = bcrypt.genSaltSync(10);
    // hasher le mot de passe
    const passwordHashed = bcrypt.hashSync(req.body.password, salt);
    try {

        const newUser = { 
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username,
            email: req.body.email,
            password: passwordHashed,
        };

        // Voir si l'utilisateur existe
        const userExist = await User.findOne({
        $or: [{ email }, { username }]
        });

        // Si l'utilisateur n'a jamais eu de compte alors on l'inscrit
        if(!userExist){
            // controle de saisie en verifiant si les champs sont vides ou absents
            if(
                !newUser.firstName ||
                !newUser.lastName ||
                !newUser.email ||
                !newUser.username ||
                !newUser.password
            ) {
                res.status(400).json({ message: "Vous devez remplir tous les champs" });
            } else {
                const user = new User(newUser);
                await user.save();

                res.status(201).json({
                    message: "Incription reussie !",
                    user: {
                        id: user._id,
                        username: user.username,
                        email: user.email,
                        role: user.role
                    }
                });
            };
        // Sinon message d'erreur disant que l'utilisateur existe deja
        } else {
            res.status(404).json({ message: "Erreur l'utilisateur a deja un compte" });
        }
    } catch(err) {
        res.status(500).json({
            message: 'Erreur cote serveur',
            error: error.message
        });
    }
})


// Connexion d'un utilisateur
router.post('/login', async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;
        if(!username || !password) {
            res.status(404).json({ message: "Veuillez remplir tous les champs" });
        };
        
        // Vérifier si l'utilisateur avec cette username existe
        const usernameExists = await User.findOne({ username });
        
        // Vérified si le password entré est correct grace à bcrypt

        const verifiedPassword = await user.comparePassword(password);

        // Si username et password sont verifiés alors on génère un jwt access token
        if(usernameExists && verifiedPassword) {
            const accessToken = jwt.sign(
                { 
                    username: username, 
                    password: password
                }, 
                JWT_SECRET,
                { expiresIn: '24h' }
            )

            res.status(200).json({
                message: "Utilisateur connectee avec succès !",
                accessToken: accessToken
            });
        } else {
            res.status(401).json({ message: "Erreur : Connexion échoué" });
        };
    } catch(err) {
        res.status(500).json({
            message: 'Erreur cote serveur',
            error: error.message
        });
    }

});


router.get('/me', authenticateToken, async (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la recuperation des donnees',
      error: error.message
    });
  }
});

module.exports = router;
module.exports = authenticateToken;