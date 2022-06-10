const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

//on créer le schéma
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

//On définié le mail comme étant unique, 2 utilisateurs ne peuvent pas avoir le même mail
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);