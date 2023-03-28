const { response } = require("express");
const { default: mongoose } = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const HttpErreur = require("../models/http-erreur");

const Place = require("../models/place");
const Utilisateur = require("../models/utilisateur");

const getPlaceById = async (requete, reponse, next) => {
  const placeId = requete.params.placeId;
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    return next(
      new HttpErreur("Erreur lors de la récupération de la place", 500)
    );
  }
  if (!place) {
    return next(new HttpErreur("Aucune place trouvée pour l'id fourni", 404));
  }
  reponse.json({ place: place.toObject({ getters: true }) });
};

const getPlacesByUserId = async (requete, reponse, next) => {
  const utilisateurId = requete.params.utilisateurId;

  let places;
  try {
    places = await Place.find({ createur: utilisateurId });
  } catch (err) {
    return next(
      new HttpErreur(
        "Erreur lors de la récupération des places de l'utilisateur",
        500
      )
    );
  }

  if (!places || places.length === 0) {
    return next(
      new HttpErreur("Aucune place trouvé pour l'utilisateur fourni", 404)
    );
  }

  reponse.json({
    places: places.map((place) => place.toObject({ getters: true })),
  });
};

const creerPlace = async (requete, reponse, next) => {
  const { titre, description, adresse, createur } = requete.body;
  const nouvellePlace = new Place({
    titre,
    description,
    adresse,
    image:
      "https://www.cmontmorency.qc.ca/wp-content/uploads/images/college/Porte_1_juin_2017-1024x683.jpg",
    createur,
  });

  let utilisateur;

  try {
    utilisateur = await Utilisateur.findById(createur);
  } catch {
    
    return next(new HttpErreur("Création de place échouée", 500));
  }

  if (!utilisateur) {
    return next(new HttpErreur("Utilisateur non trouvé selon le id"), 504);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    
    await nouvellePlace.save({ session: sess });
    //Ce n'est pas le push Javascript, c'est le push de mongoose qui récupe le id de la place et l'ajout au tableau de l'utilisateur
    console.log(utilisateur);
    utilisateur.places.push(nouvellePlace);
    await utilisateur.save({session:sess});
    await sess.commitTransaction();
    //Une transaction ne crée pas automatiquement de collection dans mongodb, même si on a un modèle
    //Il faut la créer manuellement dans Atlas ou Compass
  } catch (err) {
    
    const erreur = new HttpErreur("Création de place échouée", 500);
    return next(erreur);
  }
  reponse.status(201).json({ place: nouvellePlace });
};

const updatePlace = async (requete, reponse, next) => {
  const { titre, description } = requete.body;
  const placeId = requete.params.placeId;

  let place;

  try {
    place = await Place.findById(placeId);
    place.titre = titre;
    place.description = description;
    await place.save();
  } catch {
    return next(
      new HttpErreur("Erreur lors de la mise à jour de la place", 500)
    );
  }

  reponse.status(200).json({ place: place.toObject({ getters: true }) });
};

const supprimerPlace = async (requete, reponse, next) => {
  const placeId = requete.params.placeId;
  let place;
  try {
    place = await Place.findByIdAndRemove(placeId);
  } catch {
    return next(
      new HttpErreur("Erreur lors de la suppression de la place", 500)
    );
  }

  reponse.status(200).json({ message: "Place supprimée" });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.creerPlace = creerPlace;
exports.updatePlace = updatePlace;
exports.supprimerPlace = supprimerPlace;
