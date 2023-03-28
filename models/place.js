const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const placeSchema = new Schema({
    titre:{type: String, required: true},
    description: {type: String, required: true},
    image: {type: String, required: true},
    adresse: {type: String, required: true},
    createur:{type: mongoose.Types.ObjectId, required: true, ref:"Utilisateur"}
});

module.exports = mongoose.model("Place", placeSchema);