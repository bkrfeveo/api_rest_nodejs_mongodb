const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');
const connectDB = require('./config/db')

connectDB();

const app = express();
const port = process.env.PORT || 3000;

// Lancer le serveur sur le port 3000
app.listen(port, () => {
  console.log(`app.js est lance sur le port ${port}`);
})

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS");
  next();
})

const corsOptions = {
    // 2. Ajoutez l'origine exacte de votre frontend (Vite/React)
    origin: 'http://localhost:5173', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // 3. Autorisez les méthodes nécessaires
    credentials: true, // Si vous utilisez des cookies/sessions
};

app.use(cors(corsOptions)); // <-- 4. Utilisez le middleware CORS

// Décrypter les données en json
app.use(express.json());
// Décoder les données reçues des formulaires HTML
app.use(express.urlencoded({ extended: true }));

// Les routes pour l'authentification (inscription, connexion)
app.use('/api/auth', userRoutes);
// Les routes de CRUD des tasks
app.use('/api', taskRoutes);



