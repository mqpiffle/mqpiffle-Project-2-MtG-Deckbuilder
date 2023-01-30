const mongoose = require('../utils/connection')
const cardSchema = require('./card')

// import user model for populate
const User = require('./user')

// destructure the schema and model constructors from mongoose
const { Schema, model } = mongoose

const collectionSchema = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        cards: [cardSchema],
    },
    { timestamps: true }
)

const Collection = model('Collection', collectionSchema)

/////////////////////////////////
// Export our Model
/////////////////////////////////
module.exports = Collection
