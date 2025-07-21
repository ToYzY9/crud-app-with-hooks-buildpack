const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: [3, "Must be at least 3, got {VALUE}"],
        validate: {
            validator: function (v) {
                return /\D/.test(v);
            },
            message: (props) => `${props.value} is not a valid name!`,
        },
        required: [true, "Name required"],
    },
    username: {
        type: String,
        minlength: [3, "Must be at least 3, got {VALUE}"],
        validate: {
            validator: function (v) {
                return /\D/.test(v);
            },
            message: (props) => `${props.value} is not a valid username!`,
        },
        required: [true, "Username required"],
        unique: true,
    },
});

blogSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

module.exports = mongoose.model("BlogList", blogSchema);
