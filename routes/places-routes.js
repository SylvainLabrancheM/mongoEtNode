const express = require("express");

const controleursPlace = require("../controllers/places-controleurs")
const router = express.Router();


router.get("/:placeId", controleursPlace.getPlaceById);

router.get("/utilisateur/:utilisateurId", controleursPlace.getPlacesByUserId);

router.post('/', controleursPlace.creerPlace);

router.patch('/:placeId', controleursPlace.updatePlace);

router.delete('/:placeId', controleursPlace.supprimerPlace);

module.exports = router;
