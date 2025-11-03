const express = require('express')
const isAuthenticate = require('../middleware/authMiddleware')
const Task = require('../models/Task')
const router = express.Router();

// Recuperer tous les taches contenues dans le stockage en memoire
// isAuthenticate pour verfier si l'utilisateur est connecté
router.get('/tasks', isAuthenticate, async (req, res) => {
  try {
    // Pagination
    const { page = 1, limit = 10 } = req.query;
    // fitltrer le resultat pour affirche que les taches creee par cet utilisateur
    const filter = { createdBy: req.user[0]._id };
    // affirche ces taches
    const tasks = await Task.find(filter)
      .populate('createdBy', 'username email')
      // du plus recent au plus ancien
      .sort({ createdAt: -1 })
      // afficher les taches par groupe de 10 taches
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    // le nombre de taches trouvees
    const total = await Task.countDocuments(filter);

    res.status(200).json({
      tasks,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (err) {
    res.status(500).json({
      message: 'Erreur de recuperation des donnees',
      error: err.message
    });
  }
});


// Recuperer une tache specifique avec son ID
router.get('/tasks/:id', async (req, res) => {
  const idParam = req.params.id
  try {  
    const taskId = await Task.findById(idParam)
      .populate('createdBy', 'username email');
    
    // Verifier si la tache est present dans la base de donnees
    if (!taskId) {
      return res.status(404).json({ message: "Tache demandée introuvable" })
    }
    // Verifier si l'utlisateur a acces a la tache demandee
    if (taskId.createdBy._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Acces refuse' });
    }
    res.status(200).json({
      message: "Tache recupérée avec succès ",
      taskId: taskId
    })
    
  } catch (err) {
    res.status(500).json({
      message: 'Erreur lors de la recuperation de la tache specifiee',
      error: err.message
    });
  }
})


// Ajouter une nouvelle tache
router.post("/tasks", isAuthenticate, async (req, res) => {
  // Ajouter la tache de maniere fictif dans datas.js
  try{
    const { title, description, completed, priority, dueDate } = req.body;

    // Controle de saisie en rendant le titre et la description obligatoire
    if (!req.body.title || req.body.title === "") {
      return res.status(400).json({ message: "Le champ titre est requis !" });
    } 
    if (!req.body.description || req.body.description === "") {
      return res.status(400).json({ message: "Le champ description est requis !" });
    } 
    
    console.log(req.user[0]._id);
    
    // Creer une nouvelle tache
    const task = new Task({
      title,
      description,
      completed,
      priority,
      dueDate,
      createdBy: req.user[0]._id
    })
    // Enregistrer la tache creee
    await task.save();
    // Code 201 la tache bien est ajoutee 
    res.status(201).json({
      message: "Tache créée avec succès !",
      task: task
    });
  } catch (err) {
    res.status(500).json({
      message: 'Erreur lors de la creation de la tache',
      err: err.message
    });
  }
})


// Mettre a jour une tache specifique avec son ID
router.put("/tasks/:id", isAuthenticate, async (req, res) => {
  const idParam = req.params.id;
  try {
    const { title, description, completed, priority, dueDate, createdBy } = req.body;
    // chercher d'abord la tache a modifier
    const task = await Task.findById(idParam);
    // Verifier si elle existe
    if(!task) return res.status(404).json({ message: "Tache non trouvee "});
    
    // Verifier si l'utilisateur peut modifier la tache demandee
    if(task.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Acces refuse" })
    }  
    
    // effectuer le mis a jour
    const taskUpdated = Task.findByIdAndUpdate (
      idParam,
      {
        // soit le titre entre soit l'ancien titre reste inchange
        title: title || task.title,
        description: description || task.description,
        completed: completed || task.completed,
        priority: priority || task.priority,
        dueDate: dueDate || task.dueDate
      }
    ).populate('createdBy', 'username email');

    res.status(200).json({ 
      message: "Tache mise à jour avec succès", 
      taskUpdated: taskUpdated,
    });
    
  } catch (err) {
      res.status(500).json({
      message: 'Erreur lors de la mise a jour de la tache',
      error: err.message
    });
  }
})


// Supprimer un tache specifique avec son ID
router.delete("/tasks/:id", isAuthenticate, async (req, res) => {
  const idParam = req.params.id;
  try {
    // rechercher la tache a supprimer
    const taskDelete = await Task.findById(idParam);

    // verifier si la tache est trouvee
    if (!taskDelete) return res.status(404).json({ message: 'Tache non trouvee' });
    // Verifier si c'est l'utilisateur qui l'a creee
    if (taskDelete.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Acces refuse' });
    };

    // Supprimer la tache si y'a pas de probleme
    await Task.findByIdAndDelete(idParam);
    res.status(200).json({ message: "Tache supprimée avec succès" });
  } catch (err) {
    res.status(500).json({
      message: 'Erreur lors de la suppression de la tache',
      error: err.message
    });
  }
})

module.exports = router;