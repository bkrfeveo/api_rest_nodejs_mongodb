const http = require('node:http');
const express = require('express');
const { tasks } = require('./datas');
const { v4: uuidv4 } = require("uuid");
const app = express();
const routes = require('./tables/authRouter');
const isAuthenticate = require('./tables/authRouter')


const port = 3000;
const dateCreated = new Date();


// Lancer le serveur sur le port 3000
app.listen(port, () => {
  console.log(`app.js est lance sur le port ${port}`);
})

// Décrypter les données en json
app.use(express.json());
// Décoder les données reçues des formulaires HTML
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', routes);


// Recuperer tous les taches contenues dans le stockage en memoire
app.get('/api/tasks', isAuthenticate, (req, res) => {
  // status 200 pour montrer que la requete est reussie et l'afficher sous format JSON
  res.status(200).json({ 
    message: "Tous les taches chargées avec succès", 
    tasks: tasks 
  });
});


// Recuperer une tache specifique avec son ID
app.get('/api/tasks/:id', isAuthenticate, (req, res) => {
  // Filtrer les taches pour recupere la tache avec l'ID specifier en parametre
  const taskId = tasks.filter( (task) => task.id === req.params.id)
  if (taskId.length !== 0){
    res.status(200).json({
      message: "Tache recupérée avec succès ",
      taskId: taskId
    })
  } else {
    res.status(404).json({ message: "Tache demandée introuvable" })
  }
})


// Ajouter une nouvelle tache
app.post("/api/tasks", isAuthenticate, (req, res) => {
  // Ajouter la tache de maniere fictif dans datas.js
  tasks.push(
    {
      "id": uuidv4(),
      "title": req.body.title,
      "description": req.body.description,
      "completed": req.body.completed,
      "priority": req.body.priority,
      "dueDate": req.body.dueDate,
      "createdAt": dateCreated.toISOString() // Pour avoir le format : YYYY-MM-DDTHH:MM:SS.000Z
    }
  );
  // Controle de saisie en rendant le titre et la description obligatoire
  if (!req.body.title || req.body.title === "") {
    return res.status(400).json({ message: "Le champ titre est requis !" });
  } 
  if (!req.body.description || req.body.description === "") {
    return res.status(400).json({ message: "Le champ description est requis !" });
  } 
  // Code 201 si la tache est ajoute 
  res.status(201).json({message: "Tache créée avec succès !", task: tasks[tasks.length-1]});
})


// Mettre a jour une tache specifique avec son ID
app.put("/api/tasks/:id", isAuthenticate, (req, res) => {
  const idParam = req.params.id;
  // Recuperer la tache a mettre a jour en utilisant la methode find
  let taskUpdated = tasks.find((task) => task.id === idParam);
  console.log(taskUpdated);
  
  if (taskUpdated !== undefined){
    taskUpdated = {
      "id": idParam,
      "title": req.body.title,
      "description": req.body.description,
      "completed": req.body.completed,
      "priority": req.body.priority,
      "dueDate": req.body.dueDate,
      "modifiedAt": dateCreated.toISOString()
    }
    res.status(200).json({ 
      message: "Tache mise à jour avec succès", 
      task: taskUpdated,
    });
  } else {
    res.status(404).json({ message: "Tache demandée introuvable"})
  }
})


// Supprimer un tache specifique avec son ID
// isAuthenticate pour verfier si l'utilisateur est connecté
app.delete("/api/tasks/:id", isAuthenticate, (req, res) => {
  const idParam = req.params.id;
  const taskDelete = tasks.find((task) => task.id === idParam);
  // Supprimer la tache est trouve avec filter s'il est trouve
  if (taskDelete !== undefined) {
    const tasksRest = tasks.filter((task) => task.id !== idParam);
      res.status(200).json({
        message: "Tache supprimée avec succès",
        tasks: tasksRest
      });
  // Sinon : message d'erreur
  } else {
    res.status(404).json({ message: "Tache introuvable" })
  }
})