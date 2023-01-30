const mongoose = require('../utils/connection')

// import user model for populate
const User = require('./user')

// destructure the schema and model constructors from mongoose
const { Schema } = mongoose

const collectionSchema = new Schema(
    {
        cards: [cardSchema],
    },
    { timestamps: true }
)

/////////////////////////////////
// Export our Model
/////////////////////////////////
module.exports = cardSchema
