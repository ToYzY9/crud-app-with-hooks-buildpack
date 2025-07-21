const express = require("express");
const fs = require("fs");
const morgan = require("morgan");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const cors = require("cors");
const mongoose = require("mongoose");

// Importation des modules nécessaires

// Assigns the second command line argument to 'password'
const username = "fullstack";
const password = process.argv[2];
const dbName = "BlogApp";

// DO NOT SAVE YOUR PASSWORD TO GITHUB!!
const url = `mongodb+srv://${username}:${password}@backend-database.dqsi7.mongodb.net/${dbName}?retryWrites=true&w=majority`;

mongoose.connect(url);

const blogSchema = new mongoose.Schema({
    name: String,
    username: String,
});

blogSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

const BlogList = mongoose.model("BlogList", blogSchema);

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("dist"));
app.use(requestLogger);

// let users = [
//     {
//         id: "1",
//         name: "Tania",
//         username: "SskettO",
//     },
//     {
//         id: "2",
//         name: "Craig",
//         username: "siliconeidolon",
//     },
//     {
//         id: "3",
//         name: "Ben",
//         username: "benisphere",
//     },
//     {
//         id: "4",
//         name: "CraigO",
//         username: "Diskette",
//     },
//     {
//         id: "0xm8f4exs3",
//         name: "Des oranges",
//         username: "BenisphereO",
//     },
//     {
//         id: "0xm8glaed7",
//         name: "Closoko",
//         username: "Gainei",
//     },
// ];

// Middleware pour la journalisation des requêtes
function requestLogger(request, response, next) {
    console.log("ID:", request.id);
    console.log("Method:", request.method);
    console.log("Path:", request.path);
    console.log("Body:", request.body);
    console.log("---");
    next();
}

morgan.token("body", function (req) {
    return JSON.stringify(req.body);
});

morgan.token("id", function getId(req) {
    return req.id;
});

app.use(assignId);

// enregistrer (logger) toutes les demandes dans access.log
// log all requests to access.log
app.use(
    morgan(":id :method :url :response-time ms :body", {
        stream: fs.createWriteStream(path.join(__dirname, "access.log"), {
            flags: "a",
        }),
    })
);

// ne consigner (logger) que les réponses 4xx et 5xx dans la console
// log only 4xx and 5xx responses to console
app.use(
    morgan("dev", {
        skip: function (req, res) {
            return res.statusCode < 400;
        },
    })
);

// Middleware pour gérer les routes inconnues/inexistantes
// l'intergiciel renverra un message d'erreur au format JSON.
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: "unknown endpoint" });
};

app.use(morgan(":id :method :url :response-time ms :body"));

app.get("/", (request, response) => {
    response.send("<h1>Hello World!</h1>");
});

app.get("/api/users", (request, response) => {
    BlogList.find({}).then((users) => {
        response.json(users);
    });
});

app.get("/api/users/:id", (request, response) => {
    const id = request.params.id;
    const user = users.find((user) => user.id === id);
    if (user) {
        console.log("user", user.id);
        response.json(user);
    } else {
        response.status(404).end();
    }
});

app.delete("/api/users/:id", (request, response) => {
    const id = request.params.id;
    const user = users.find((user) => user.id === id);
    if (user) {
        users.splice(users.indexOf(user), 1);
        response.status(204).end();
    } else {
        response.status(404).end();
    }
});

const GenerateUIDTimestamp = () => {
    return Date.now().toString(36);
};

app.post("/api/users", (request, response) => {
    const body = request.body;

    if (!body.name) {
        return response.status(400).json({
            error: "Name missing",
        });
    }
    if (!body.username) {
        return response.status(400).json({
            error: "Username missing",
        });
    }

    const user = {
        id: `0x${GenerateUIDTimestamp()}`,
        name: body.name,
        username: body.username,
    };

    users = users.concat(user);
    response.json(user);
});

function assignId(req, res, next) {
    req.id = uuidv4();
    next();
}

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
