// *********** *********** *********** //
//  Dependencies                       //
// *********** *********** *********** //

const mongoose = require('../utils/connection.js')

// *********** *********** *********** //
//  Construct Schema                   //
// *********** *********** *********** //

// destructure the schema and model constructors from mongoose

const { Schema, model } = mongoose

const UserSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
)

// *********** *********** *********** //
//  Build and Export Model             //
// *********** *********** *********** //

const User = model('User', UserSchema)

module.exports = User
