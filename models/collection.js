// *********** *********** *********** //
//  Dependencies                       //
// *********** *********** *********** //

const mongoose = require('../utils/connection')
const cardSchema = require('./card')

// *********** *********** *********** //
//  Construct Schema                   //
// *********** *********** *********** //

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

// *********** *********** *********** //
//  Build and Export Model             //
// *********** *********** *********** //

const Collection = model('Collection', collectionSchema)

module.exports = Collection
