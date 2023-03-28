const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const utilsateurSchema = new Schema({
    nom:{type: String, required: true},
    courriel: {type: String, required: true, unique:true},
    motDePasse: {type: String, required: true, minLength: 6},
    image: {type: String, required: true},
    places: [{type: mongoose.Types.ObjectId, required: true, ref:"Place"}]
});



module.exports = mongoose.model("Utilisateur", utilsateurSchema);