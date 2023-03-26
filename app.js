const express = require('express');
const bodyParser = require('body-parser');

const placesRoutes = require("./routes/places-routes")
const utilisateursRoutes = require("./routes/utilisateurs-routes")
const HttpErreur = require("./models/http-erreur");

const app = express();

app.use(bodyParser.json());

app.use("/api/places", placesRoutes);
app.use("/api/utilisateurs", utilisateursRoutes);

app.use((requete, reponse, next) => {
    return next(new HttpErreur("Route non trouvée", 404));
});

app.use((error, requete, reponse, next) => {
    if(reponse.headerSent){
        return next(error);
    }
    reponse.status(error.code || 500);
    reponse.json({message: error.message || "Une erreur inconnue est survenue" });
})



app.listen(5000);