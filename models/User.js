const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
// le schema de l'utilisateur
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'le prenom est requis'],
    unique: true,
    trim: true,
    minlength: [3, 'le prenom doit avoir au moins 3 characters long']
  },
   lastName: {
    type: String,
    required: [true, 'le nom  est requis'],
    unique: true,
    trim: true,
    minlength: [3, 'le nom doit avoir au moins 3 characters long']
  },
   username: {
    type: String,
    required: [true, 'le nom d\'utilisateur est requis'],
    unique: true,
    trim: true,
    minlength: [3, 'le nom doit avoir au moins 3 characters long']
  },
  email: {
    type: String,
    required: [true, 'l\'mail est requis'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Veuillez entrer un email valid']
  },
  password: {
    type: String,
    required: [true, 'le mot de passe est requis'],
    minlength: [6, 'le mot de passe doit avoir au moins 6 characters long']
  },
  tasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true,
  }],
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hasher le mot de passe avant  de l'enregistrer
// userSchema.pre('save', async function(next) {
//   if (!this.isModified('password')) return next();
  
//   try {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
//   } catch (error) {
//     next(error);
//   }
// });

// Verifier si le mot de passe est correct
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Supprimer le mot de passe
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model('User', userSchema);