const express = require('express');
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

// Décrypter les données en json
app.use(express.json());
// Décoder les données reçues des formulaires HTML
app.use(express.urlencoded({ extended: true }));

// Les routes pour l'authentification (inscription, connexion)
app.use('/api/auth', userRoutes);
// Les routes de CRUD des tasks
app.use('/api', taskRoutes);



