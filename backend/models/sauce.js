const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

//on crée le schéma qui sera en bdd
const sauceSchema = mongoose.Schema({
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    heat: { type: Number, required: true },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    imageUrl: { type: String, required: true },
    mainPepper: { type: String, required: true },
    usersLiked: [{ type: String, default: null }],
    usersDisliked: [{ type: String, default: null }],
    userId: { type: String, required: true },
    heatValue: { type: Number }
});

module.exports = mongoose.model('Sauce', sauceSchema);