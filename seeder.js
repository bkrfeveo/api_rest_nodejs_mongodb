// Gestion de la logique d'importation et d'effacement des données.
const mongoose = require('mongoose');
const User = require('./models/User');
const Task = require('./models/Task');
const connectDB = require('./config/db');
const bcrypt = require('bcryptjs');

const migrateData = async () => {
  await connectDB();
  
  // Vos anciennes données fictives
  const oldUsers = [
    { 
        firstName: "Abdoulaye",
        lastName: "Ndiaye",
        username: "Abdou",
        email: "layendiaye2@gmail.com",
        password: bcrypt.hashSync("password123", 10)
    },
    { 
        firstName: "Fallou",
        lastName: "Niang",
        username: "fadel",
        email: "fadelniang21@gmail.com",
        password: bcrypt.hashSync("passer2025", 10)
    },
    { 
        firstName: "Sokhna",
        lastName: "Fall",
        username: "sokhna",
        email: "sofall70@gmail.com",
        password: bcrypt.hashSync("motdepasse32", 10)
    },
  ];
  
  const oldTasks = [
    {
        username: "Abdou",
        title: "Faire les courses",
        description: "Acheter du pain et du lait",
        completed: true,
        priority: "high",
        dueDate: "2025-10-25",
        createdAt: "2025-10-21T10:00:00Z"
    },
    {
        username: "fadel",
        title: "Rendre visite mes amis",
        description: "L'apres midi à 16h. Rendre visite Modou pour discuter avec lui",
        completed: false,
        priority: "low",
        dueDate: "2025-10-29",
        createdAt: "2025-10-29T16:00:00Z"
    },
    {
        username: "sokhna",
        title: "Faire de la natation",
        description: "Je dois me preparer a l'examen de natation qui sera dans une semaine.",
        completed: false,
        priority: "medium",
        dueDate: "2025-10-31",
        createdAt: "2025-10-21T10:00:00Z"
    },
  ];
  
  try {
    // Nettoyer la base de données
    await User.deleteMany({});
    await Task.deleteMany({});
    
    // Migrer les utilisateurs
    const migratedUsers = [];
    for (const oldUser of oldUsers) {
      const user = new User(oldUser);
      await user.save();
      migratedUsers.push(user);
    }
    
    // Migrer les tâches
    for (const oldTask of oldTasks) {
      const assignedUser = migratedUsers.find(u => u.username === oldTask.username);
      const task = new Task({
        ...oldTask,
        createdBy: assignedUser._id
      });
      await task.save();
    }
    
    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrateData();