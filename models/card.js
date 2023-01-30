const mongoose = require('../utils/connection')

// import user model for populate
const User = require('./user')

// destructure the schema and model constructors from mongoose
const { Schema } = mongoose

const cardSchema = new Schema(
    {
        name: { type: String, required: true },
        mtgId: { type: String, required: true },
        image: { type: String },
        count: { type: Number, required: true, min: 1 },
    },
    { timestamps: true }
)

/////////////////////////////////
// Export our Model
/////////////////////////////////
module.exports = cardSchema
