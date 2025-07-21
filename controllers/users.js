const usersRouter = require("express").Router();
const BlogList = require("../models/user");

usersRouter.get("/", (request, response, next) => {
    BlogList.find({})
        .then((users) => {
            response.json(users);
        })
        .catch((error) => next(error));
});

usersRouter.get("/:id", (request, response, next) => {
    BlogList.findById(request.params.id)
        .then((user) => {
            if (user) {
                response.json(user);
            } else {
                response.status(404).json({ error: "User not found" });
            }
        })
        .catch((error) => next(error));
});

usersRouter.delete("/:id", (request, response, next) => {
    BlogList.findByIdAndDelete(request.params.id)
        .then((result) => {
            response.status(204).end();
        })
        .catch((error) => next(error));
});

usersRouter.put("/:id", (request, response, next) => {
    const { name, username } = request.body;

    BlogList.findByIdAndUpdate(
        request.params.id,
        { name, username },
        { new: true, runValidators: true, context: "query" }
    )
        .then((updatedUser) => {
            response.json(updatedUser);
        })
        .catch((error) => next(error));
});

usersRouter.post("/", (request, response, next) => {
    const body = request.body;

    if (!body.name) {
        return response.status(400).json({
            error: "Name missing",
        });
    } else if (!body.username) {
        return response.status(400).json({
            error: "Username missing",
        });
    }

    BlogList.findOne({ username: body.username })
        .then((user) => {
            if (body.username === user.username) {
                return response.status(400).json({
                    error: "The username must be unique",
                });
            }
        })
        .catch((error) => next(error));

    const user = new BlogList({
        name: body.name,
        username: body.username,
    });

    user.save()
        .then((savedUser) => {
            response.json(savedUser);
        })
        .catch((error) => next(error));
});

module.exports = usersRouter;
