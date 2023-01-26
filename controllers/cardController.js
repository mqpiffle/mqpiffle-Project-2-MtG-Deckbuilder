// *********** *********** *********** //
//  Dependencies                       //
// *********** *********** *********** //
const express = require('express')
const Deck = require('../models/deck')

// *********** *********** *********** //
//  Router                             //
// *********** *********** *********** //
const router = express.Router()

// *********** *********** *********** //
//  Routes                             //
// *********** *********** *********** //

// POST route -> cards/<deckid>
router.post('/:deckId', (req, res) => {
    // save the id from the param
    const deckId = req.params.deckId
    // save the card body for later
    const theCard = req.body
    console.log(theCard)
    // extra layer of protection from not-loggin-in intruders
    if (req.session.loggedIn) {
        Deck.findById(deckId)
            .then(deck => {
                // push the card into the array and save the document
                deck.cards.push(theCard)
                return deck.save()
            })
            .then(deck => {
                // then redirect back to the edit page
                res.redirect(`/decks/${deck.id}/edit`)
            })
            .catch(err => {
                console.log(err)
                // handle errors
                res.redirect(`/error?error=${err}`)
            })
    } else {
        // if not logged, get a 401 unauthorized status
        res.redirect(
            `/error?error=You%20Are%20not%20allowed%20to%20comment%20on%20this%20fruit`
        )
    }
})
// *********** *********** *********** //
//  Export Router                      //
// *********** *********** *********** //
module.exports = router
