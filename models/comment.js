// import dependencies
const mongoose = require("../utils/connection");

// import user model for populate
const User = require("./user");

// destructure the schema and model constructors from mongoose
const { Schema } = mongoose;

const commentSchema = new Schema(
    {
        heading: { type: String, required: true },
        body: { type: String, required: true },
        owner: {
            type: Schema.Types.ObjectID,
            ref: "User",
        },
    },
    { timestamps: true }
);

/////////////////////////////////
// Export our Model
/////////////////////////////////
module.exports = commentSchema;
