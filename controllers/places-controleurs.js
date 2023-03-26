const { response } = require("express");
const { v4: uuidv4 } = require("uuid");

const HttpErreur = require("../models/http-erreur");
const Place = require("../models/place");

let PLACES = [
  {
    id: "p1",
    titre: "Empire State Building",
    description: "Grosse bâtisse!",
    location: {
      lat: 40.7484474,
      lng: -73.9871516,
    },
    adresse: "20 W 34th St, New York, NY 10001",
    createur: "u1",
  },
];

const getPlaceById = async (requete, reponse, next) => {
  const placeId = requete.params.placeId;
  let place;
  try {
    place = await Place.findById(placeId);
  } catch {
    return next(
      new HttpErreur("Erreur lors de la récupération de la place", 500)
    );
  }
  if (!place) {
    return next(new HttpErreur("Aucune place trouvée pour l'id fourni", 404));
  }
  reponse.json({ place: place.toObject({getters:true}) });
};

const getPlacesByUserId = (requete, reponse, next) => {
  const utilisateurId = requete.params.utilisateurId;

  const places = PLACES.filter((place) => {
    return place.createur === utilisateurId;
  });

  if (!places || places.length === 0) {
    return next(
      new HttpErreur("Aucune place trouvé pour l'utilisateur fourni", 404)
    );
  }

  reponse.json({ places });
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
  try {
    await nouvellePlace.save();
  } catch (err) {
    const erreur = new HttpErreur("Création de place échouée", 500);
    return next(erreur);
  }
  reponse.status(201).json({ place: nouvellePlace });
};

const updatePlace = (requete, reponse, next) => {
  const { titre, description } = requete.body;
  const placeId = requete.params.placeId;

  //Créer une copie de la place, changer la copie puis remplacer l'originale dans le tableau par la copie.
  //const placeModifiee = PLACE.find(place => place.id === placeId);
  //L'opérateur ... fait une copie de toutes les pairs clé/valeur, donc de la place elle-même
  const placeModifiee = { ...PLACES.find((place) => place.id === placeId) };
  const indicePlace = PLACES.findIndex((place) => place.id === placeId);

  placeModifiee.titre = titre;
  placeModifiee.description = description;

  PLACES[indicePlace] = placeModifiee;

  reponse.status(200).json({ place: placeModifiee });
};

const supprimerPlace = (requete, reponse, next) => {
  const placeId = requete.params.placeId;
  PLACES = PLACES.filter((place) => place.id !== placeId);
  reponse.status(200).json({ message: "Place supprimée" });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.creerPlace = creerPlace;
exports.updatePlace = updatePlace;
exports.supprimerPlace = supprimerPlace;
