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

router.post('/:deckId', (req, res) => {
    const { deckId } = req.params

    if (req.session.loggedIn) {
        req.body.author = req.session.userId
        const theComment = req.body
        console.log(theComment)
        Deck.findById(deckId)
            .then(deck => {
                deck.comments.push(theComment)
                return deck.save()
            })
            .then(deck => {
                res.redirect(`/decks/${deck.id}`)
            })
            .catch(err => {
                console.log(err)
                res.redirect(`/error?error=${err}`)
            })
    } else {
        res.redirect(
            `/error?error=You%20Are%20not%20allowed%20to%20comment%20on%20this%20fruit`
        )
    }
})

router.delete('/delete/:deckId/:commId', (req, res) => {
    const { deckId, commId } = req.params
    Deck.findById(deckId)
        .then(deck => {
            const theComment = deck.comments.id(commId)
            if (req.session.loggedIn) {
                if (theComment.author == req.session.userId) {
                    theComment.remove()
                    deck.save()
                    res.redirect(`/decks/${deck.id}`)
                } else {
                    res.redirect(
                        `/error?error=You%20Are%20not%20allowed%20to%20delete%20this%20comment`
                    )
                }
            } else {
                res.redirect(
                    `/error?error=You%20Are%20not%20allowed%20to%20delete%20this%20comment`
                )
            }
        })
        .catch(err => {
            console.log(err)
            res.redirect(`error?error=${err}`)
        })
})

// *********** *********** *********** //
//  Export Router                      //
// *********** *********** *********** //
module.exports = router
