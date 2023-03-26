const {v4 : uuidv4} = require("uuid");
const HttpErreur = require("../models/http-erreur")

const UTILISATEURS = [
    {
        id: "u1",
        nom: "Sylvain Labranche",
        courriel: "slabranche@cmontmorency.qc.ca",
        motDePasse: "test"
    }

];

const getUtilisateurs = (requete, reponse, next) => {
    reponse.json({utilisateurs: UTILISATEURS});

};

const inscription = (requete, reponse, next) => {
    const {nom, courriel, motDePasse} = requete.body;

    const courrielExiste = UTILISATEURS.find(u => u.courriel === courriel);
    if(courrielExiste){
        throw new HttpErreur("Utilisateur existe déjà", 422);
    }

    const nouvelUtilisateur = {
        id: uuidv4(),
        nom, // nom: nom
        courriel,
        motDePasse
    }

    UTILISATEURS.push(nouvelUtilisateur);

    reponse.status(201).json(nouvelUtilisateur);
};

const connexion = (requete, reponse, next) => {
    const {courriel, motDePasse} = requete.body;

    const utilisateur = UTILISATEURS.find(util => util.courriel === courriel);

    if(!utilisateur || utilisateur.motDePasse !== motDePasse){
        throw new HttpErreur("Courriel ou mot de passe incorrect", 401);
    }
    
    reponse.json({message: "connexion réussie!"});
};

exports.getUtilisateurs = getUtilisateurs;
exports.inscription = inscription;
exports.connexion = connexion;