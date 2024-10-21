  const mongoose = require('mongoose');
  const bcrypt = require('bcrypt')

  const teamSchema = new mongoose.Schema({
      username: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      status: { type: String, enum: [ 'online', 'offline' ], default: 'offline' },
      roles: { type: String, enum: [ 'admin', 'user', 'staff'] },
      lastLoggedIn: { type: Date, default: Date.now() }
  });

  teamSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  });

  teamSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  };

  const Team = mongoose.model('Team', teamSchema);

  module.exports = Team;