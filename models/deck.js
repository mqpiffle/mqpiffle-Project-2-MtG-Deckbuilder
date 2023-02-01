// *********** *********** *********** //
//  Dependencies                       //
// *********** *********** *********** //

const mongoose = require('../utils/connection')
const commentSchema = require('./comment')
const cardSchema = require('./card')

// *********** *********** *********** //
//  Construct Schema                   //
// *********** *********** *********** //

// import user model for populate

const User = require('./user')

// destructure the schema and model constructors from mongoose

const { Schema, model } = mongoose

const deckSchema = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        owner: {
            type: Schema.Types.ObjectID,
            ref: 'User',
        },
        cards: [cardSchema],
        comments: [commentSchema],
        stock: { type: String, required: true },
    },
    {
        timestamps: true,
        virtuals: true,
        toObject: {
            virtuals: true,
        },
        toJSON: {
            virtuals: true,
        },
    }
)

// *********** *********** *********** //
//  Build Virtuals                     //
// *********** *********** *********** //

// this virtual accesses the count property of every card in the deck with .map()
// then adds all of those counts together with .reduce()
// so they can be accessed on the front end with the totalCount property

deckSchema.virtual('totalCount').get(function () {
    return this.cards.map(card => card.count).reduce((x, y) => x + y, 0)
})

// *********** *********** *********** //
//  Build and Export Model             //
// *********** *********** *********** //

const Deck = model('Deck', deckSchema)

module.exports = Deck
