const {v4 : uuidv4} = require("uuid");
const HttpErreur = require("../models/http-erreur")

const Utilisateur = require("../models/utilisateur");

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

const inscription = async (requete, reponse, next) => {
    const {nom, courriel, motDePasse, places} = requete.body;

    let utilisateurExiste;

    try{
        utilisateurExiste = await Utilisateur.findOne({courriel:courriel});
    }catch{
       return next( new HttpErreur("Échec vérification utilisateur existe", 500));
    }

    if(utilisateurExiste){
        return next(new HttpErreur("Utilisateur existe déjà, veuillez vos connecter", 422));
    }

    let nouvelUtilisateur = new Utilisateur({
        nom,
        courriel,
        image:"image.png",
        motDePasse,
        places
    })
    try{
        await nouvelUtilisateur.save();
    }catch(err){
        console.log(err);
        return next(new HttpErreur("Erreur lors de l'ajout de l'utilisateur", 422));
    }
    reponse.status(201).json({utilisateur:nouvelUtilisateur.toObject({getter:true})});
};

const connexion = async (requete, reponse, next) => {
    const {courriel, motDePasse} = requete.body;

    let utilisateurExiste;

    try{
        utilisateurExiste = await Utilisateur.findOne({courriel:courriel});
    }catch{
       return next( new HttpErreur("Connexion échouée, veuillez réessayer plus tard", 500));
    }

    if(!utilisateurExiste || utilisateurExiste.motDePasse !== motDePasse){
        return next( new HttpErreur("Courriel ou mot de passe incorrect", 401));
    }
    
    reponse.json({message: "connexion réussie!"});
};

exports.getUtilisateurs = getUtilisateurs;
exports.inscription = inscription;
exports.connexion = connexion;