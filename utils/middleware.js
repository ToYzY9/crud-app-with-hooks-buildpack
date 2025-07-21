const { v4: uuidv4 } = require("uuid");
const logger = require("./logger");
const fs = require("fs");
const morgan = require("morgan");
const path = require("path");

morgan.token("body", function (req) {
    return JSON.stringify(req.body);
});

morgan.token("id", function getId(req) {
    return req.id;
});

// enregistrer (logger) toutes les demandes dans access.log
// log all requests to access.log
const logAllRequestToAccessLog = () => {
    return morgan(
        ":remote-addr - :remote-user [:date[clf]] :id :method :status - :res[content-length] :url :response-time ms :body",
        {
            stream: fs.createWriteStream(
                path.join(__dirname, "..", "access.log"),
                {
                    flags: "a",
                }
            ),
        }
    );
};

// ne consigner (logger) que les réponses 4xx et 5xx dans la console
// log only 4xx and 5xx responses to console
function logOnlyError4xxAnd5xx() {
    return morgan("dev", {
        skip: function (req, res) {
            return res.statusCode < 400;
        },
    });
}

const logPersonalized = () => {
    return morgan(`:id :method :url :response-time ms :body`);
};

// Middleware pour la journalisation des requêtes
function requestLogger(request, response, next) {
    logger.info("Method:", request.method);
    logger.info("Path:", request.path);
    logger.info("Body:", request.body);
    logger.info("---");
    next();
}

// Middleware pour gérer les routes inconnues/inexistantes
// l'intergiciel renverra un message d'erreur au format JSON.
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: "unknown endpoint" });
};

function assignId(req, res, next) {
    req.id = uuidv4();
    next();
}

const errorHandler = (error, request, response, next) => {
    logger.error(error.message);

    if (error.name === "CastError") {
        return response.status(400).send({ error: "malformatted id" });
    } else if (error.name === "ValidationError") {
        return response.status(400).json({ error: error.message });
    } else if (error.code === 11000) {
        return response
            .status(400)
            .json({ error: "The username must be unique" });
    }
    next(error);
};

module.exports = {
    requestLogger,
    unknownEndpoint,
    assignId,
    errorHandler,
    logOnlyError4xxAnd5xx,
    logPersonalized,
    logAllRequestToAccessLog,
};
