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
                // TODO if the card already exists in cards
                if (deck.cards.length > 0) {
                    for (let i = 0; i < deck.cards.length; i++) {
                        if (deck.cards.name === theCard.name) {
                            // return to the edit page
                            res.redirect(`/decks/${deck.id}/edit`)
                        }
                    }
                }
                // else
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

// UPDATE route -> cards/<deckId>
router.put('/:deckId/:cardId', (req, res) => {
    const { deckId, cardId } = req.params
    const { adjustor } = req.body
    console.log(adjustor)
    Deck.findById(deckId)
        .then(deck => {
            const card = deck.cards.id(cardId)
            console.log(card)
            if (adjustor === 'add') {
                card.count = card.count + 1
            } else {
                if (card.count == 1) {
                    card.count = 1
                } else {
                    card.count = card.count - 1
                }
            }
            console.log(`updated card: `, card)
            return deck.save()
        })
        .then(deck => {
            res.redirect(`/decks/${deck.id}/edit`)
        })
        .catch(error => {
            res.redirect(`/error?error=${error}`)
        })
})

// DELETE route -> cards/delete/<deckid>/<cardid>
router.delete('/delete/:deckId/:cardId', (req, res) => {
    const { deckId, cardId } = req.params
    // get the deck
    Deck.findById(deckId)
        .then(deck => {
            // get the card using the mongoose subdoc method .id()
            const theCard = deck.cards.id(cardId)
            // make sure user is logged in
            if (req.session.loggedIn) {
                // .remove() is another mongoose subdoc method
                theCard.remove()
                deck.save()
                res.redirect(`/decks/${deck.id}/edit`)
            } else {
                // if user is not logged in
                res.redirect(
                    `/error?error=You%20Are%20not%20allowed%20to%20delete%20this%20card`
                )
            }
        })
        .catch(err => {
            console.log(err)
            res.redirect(`/error?error=${err}`)
        })
})
// *********** *********** *********** //
//  Export Router                      //
// *********** *********** *********** //
module.exports = router
