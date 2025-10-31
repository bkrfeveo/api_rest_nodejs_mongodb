const express = require('express')
const router = express.Router();

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require("uuid");


const users = [
    { 
        "id": uuidv4(),
        "firstName": "Abdoulaye",
        "lastName": "Ndiaye",
        "username": "Abdou",
        "email": "layendiaye2@gmail.com",
        "password": bcrypt.hashSync("password123", 10)
    },
    { 
        "id": uuidv4(),
        "firstName": "Fallou",
        "lastName": "Niang",
        "username": "fadel",
        "email": "fadelniang21@gmail.com",
        "password": bcrypt.hashSync("passer2025", 10)
    },
    { 
        "id": uuidv4(),
        "firstName": "Sokhna",
        "lastName": "Fall",
        "username": "sokhna",
        "email": "sofall70@gmail.com",
        "password": bcrypt.hashSync("motdepasse32", 10)
    },
];

const JWT_SECRET = '02c0e3997ebada3dd8f9a4b9195edd55d2c0ce93e5401368b8325727c34466f30a87756a7cea051e73c1ddb82102fbabd3394873125ebc2c173e0c9e56513d49';



const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"
    // console.log('token :', token);

    if (!token) {
        return res.status(401).json({ message: 'Token d\'accès requis' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            console.log('err : ', err);
            return res.status(403).json({ message: 'Token invalide' });
        }
        req.user = user;
        next();
    });
};


// Inscrire un nouveau user
router.post('/register', (req, res) => {
    // salt permet d'ajouter des caracteres speciaux aleatoires au moment du hashage
    const salt = bcrypt.genSaltSync(10);
    // hasher le mot de passe
    const passwordHashed = bcrypt.hashSync(req.body.password, salt);

    const newUser = { 
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        email: req.body.email,
        password: passwordHashed,
    };

    // Si les 2 comparaisons sont vraies alors userExist sera true
    const userExist = users.some((user) => {
        user.username === req.body.username &&
        user.email === req.body.email
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
            users.push(newUser)
            res.status(200).json({
                message: "Incription reussie !",
                user: users
            });
        };
    // Sinon message d'erreur disant que l'utilisateur existe deja
    } else {
        res.status(404).json({ message: "Erreur l'utilisateur a deja un compte" });
    }
})


// Connexion d'un utilisateur
router.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if(!username || !password) {
        res.status(404).json({ message: "Veuillez remplir tous les champs" });
    };

    // Vérifier si l'utilisateur avec cette username existe
    const userData = users.filter((user) => user.username === username); // Array []
    const usernameExists = users.some((user) => user.username === username); // True or false
    // Vérified si le password entré est correct grace à bcrypt
    const verifiedPassword = bcrypt.compareSync(password, userData[0].password); // True or false 

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
});


router.get('/me', authenticateToken, (req, res) => {
  res.status(200).send('Ce route est protegé');
});

module.exports = router;
module.exports = authenticateToken;