const config = require("./utils/config"); // Importation de la configuration
const express = require("express");
const app = express();
const cors = require("cors");
const usersRouter = require("./controllers/users"); // Importation du routeur des utilisateurs
const middleware = require("./utils/middleware"); // Importation des middlewares personnalisés
const logger = require("./utils/logger"); // Importation du logger
const mongoose = require("mongoose");
// Importation des modules nécessaires

// Configuration de Mongoose pour ne pas utiliser les requêtes strictes
mongoose.set("strictQuery", false);
// Connexion à la base de données MongoDB
// La connexion à la base de données est gérée dans app.js,
mongoose
    .connect(config.MONGODB_URI)
    .then((result) => {
        logger.info("connected to MongoDB");
    })
    .catch((error) => {
        logger.info("error connecting to MongoDB:", error.message);
    });

app.use(express.json());
app.use(cors());
app.use(express.static("dist"));

app.use(middleware.assignId);

app.use(middleware.requestLogger);

// Use the middleware for logging all requests to access.log
app.use(middleware.logAllRequestToAccessLog());

// Use the middleware for logging 4xx and 5xx responses to console
app.use(middleware.logOnlyError4xxAnd5xx());

// Use the middleware for logging personalized responses to console
app.use(middleware.logPersonalized());

// Utilisation du routeur des utilisateurs
app.use("/api/users", usersRouter);

app.use(middleware.unknownEndpoint);
// this has to be the last loaded middleware.
app.use(middleware.errorHandler);

module.exports = app;
