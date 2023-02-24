// *********** *********** *********** //
//  Dependencies                       //
// *********** *********** *********** //

const mongoose = require('../utils/connection')

// *********** *********** *********** //
//  Construct Schema                   //
// *********** *********** *********** //

// destructure the schema and model constructors from mongoose

const { Schema } = mongoose

const cardSchema = new Schema(
    {
        name: { type: String, required: true },
        mtgId: { type: String, required: true },
        image: { type: String },
        color: { type: [String] },
        count: { type: Number, required: true, min: 1 },
    },
    { timestamps: true }
)

// *********** *********** *********** //
//  Export Schema                      //
// *********** *********** *********** //

module.exports = cardSchema
