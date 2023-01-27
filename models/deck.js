// import dependencies
const mongoose = require('../utils/connection')
const commentSchema = require('./comment')
const cardSchema = require('./card')

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

deckSchema.virtual('totalCount').get(function () {
    return this.cards.map(card => card.count).reduce((x, y) => x + y)
})

const Deck = model('Deck', deckSchema)
// virtual to loop over card to build out object
// using count

/////////////////////////////////
// Export our Model
/////////////////////////////////
module.exports = Deck
