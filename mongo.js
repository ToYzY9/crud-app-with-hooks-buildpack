const mongoose = require("mongoose");

if (process.argv.length < 3) {
    console.log(
        "Please provide the password as an argument: node mongo.js <password>"
    );
    process.exit(1);
}

const username = "fullstack";
const password = process.argv[2];
const dbName = "BlogApp";

const url = `mongodb+srv://${username}:${password}@backend-database.dqsi7.mongodb.net/${dbName}?retryWrites=true&w=majority`;

const blogSchema = new mongoose.Schema({
    name: String,
    username: String,
});

const BlogList = mongoose.model("BlogList", blogSchema);

mongoose.connect(url);

BlogList.find({}).then((result) => {
    result.forEach((note) => {
        console.log(note);
    });
    mongoose.connection.close();
});
