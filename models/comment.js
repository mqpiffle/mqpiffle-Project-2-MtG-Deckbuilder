// *********** *********** *********** //
//  Dependencies                       //
// *********** *********** *********** //

const mongoose = require('../utils/connection')

// import user model for populate

const User = require('./user')

// *********** *********** *********** //
//  Construct Schema                   //
// *********** *********** *********** //

// destructure the schema and model constructors from mongoose

const { Schema } = mongoose

const commentSchema = new Schema(
    {
        heading: { type: String, required: true },
        note: { type: String, required: true },
        author: {
            type: Schema.Types.ObjectID,
            ref: 'User',
            required: true,
        },
    },
    { timestamps: true }
)

// *********** *********** *********** //
//  Export Schema                      //
// *********** *********** *********** //

module.exports = commentSchema
