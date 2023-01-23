// import dependencies
const mongoose = require("../utils/connection");

// import user model for populate
const User = require("./user");

// destructure the schema and model constructors from mongoose
const { Schema, model } = mongoose;

const deckSchema = new Schema(
    {
        title: { type: String, required: true },
        body: { type: String, required: true },
        amount: { type: Number, required: true },
        ready: { type: Boolean, required: true },
        owner: {
            type: Schema.Types.ObjectID,
            ref: "User",
        },
    },
    { timestamps: true }
);

const Deck = model("Deck", deckSchema);

/////////////////////////////////
// Export our Model
/////////////////////////////////
module.exports = Deck;
