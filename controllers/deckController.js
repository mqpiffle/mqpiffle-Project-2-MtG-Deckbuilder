// *********** *********** *********** //
//  Dependencies                       //
// *********** *********** *********** //

const express = require('express')
const Deck = require('../models/deck')
const Collection = require('../models/collection')
const axios = require('axios')
require('dotenv').config()

// *********** *********** *********** //
//  Router                             //
// *********** *********** *********** //

const router = express.Router()

// Router Middleware
// Authorization middleware
// If you have some resources that should be accessible to everyone regardless of loggedIn status
// this middleware can be moved, commented out, or deleted.

// router.use((req, res, next) => {
// checking the loggedIn boolean of our session
// if (req.session.loggedIn) {
// if they're logged in, go to the next thing(thats the controller)
//     next()
// } else {
// if they're not logged in, send them to the login page
//         res.redirect('/auth/login')
//     }
// })

// *********** *********** *********** //
//  Routes                             //
// *********** *********** *********** //

// index ALL
router.get('/', (req, res) => {
    Deck.find({})
        .populate('owner', 'username')
        .populate('comments.author', 'username')
        .then(decks => {
            res.render('decks/index', { decks, ...req.session })
        })
        .catch(error => {
            res.redirect(`/error?error=${error}`)
        })
})

// index that shows only the user's examples
router.get('/mine', (req, res) => {
    // destructure user info from req.session
    const { userId } = req.session
    Deck.find({ owner: userId })
        .populate('owner', 'username')
        .populate('comments.author', 'username')
        .then(decks => {
            res.render('decks/index', { decks, ...req.session })
        })
        .catch(error => {
            res.redirect(`/error?error=${error}`)
        })
})

// new route -> GET route that renders our page with the form
// when i go to the new page, i want to render all of the cards in the
// allowed collection to the page. these can be added with an add button
router.get('/new', (req, res) => {
    // console.log(cards)
    Collection.find({}).then(collections => {
        res.render('decks/new', { collections, ...req.session })
    })
})

// create -> POST route that actually calls the db and makes a new document
router.post('/', (req, res) => {
    req.body.owner = req.session.userId
    Deck.create(req.body)
        .then(deck => {
            res.redirect('/decks')
        })
        .catch(error => {
            res.redirect(`/error?error=${error}`)
        })
})

// edit route -> GET that takes us to the edit form view
router.get('/:id/edit', async (req, res) => {
    const { loggedIn } = req.session
    // we need to get the id
    const deckId = req.params.id
    // const card = await axios(`${process.env.MTG_URL}?set=4ED&random=true`)
    // if a card is selected, push the data passed from the req.body
    // into the cardArray to be displayed in the list

    // cards returns an object as data which includes one element
    // and array of cards
    // need to drill down into that array to access the properties needed
    // const cards = card.data.cards.map(card => {
    //     return { image: card.imageUrl, id: card.id, name: card.name }
    // })
    if (loggedIn) {
        Deck.findById(deckId)
            .then(deck => {
                Collection.findById(deck.stock)
                    .then(collection => {
                        console.log(collection.cards)
                        res.render('decks/edit', {
                            deck,
                            collection,
                            ...req.session,
                        })
                    })
                    .catch(error => {
                        res.redirect(`/error?error=${error}`)
                    })
            })
            .catch(error => {
                res.redirect(`/error?error=${error}`)
            })
    } else {
        res.redirect('/auth/login')
    }
})

// edit route -> GET that takes us to the edit form view
router.get('/:id/edit-info', async (req, res) => {
    // we need to get the id
    const deckId = req.params.id
    Deck.findById(deckId)
        .then(deck => {
            res.render('decks/edit-info', { deck, ...req.session })
        })
        .catch(error => {
            res.redirect(`/error?error=${error}`)
        })
})

// update route
router.put('/:id', (req, res) => {
    const deckId = req.params.id

    Deck.findByIdAndUpdate(deckId, req.body, { new: true })
        .then(deck => {
            res.redirect(`/decks/${deck.id}/edit`)
        })
        .catch(error => {
            res.redirect(`/error?error=${error}`)
        })
})

// show route
router.get('/:id', (req, res) => {
    const id = req.params.id
    Deck.findById(id)
        .populate('comments.author', 'username')
        .then(deck => {
            res.render('decks/show', { deck, ...req.session })
        })
        .catch(error => {
            res.redirect(`/error?error=${error}`)
        })
})

// delete route
router.delete('/:id', (req, res) => {
    const deckId = req.params.id
    Deck.findByIdAndRemove(deckId)
        .then(() => {
            res.redirect('/decks')
        })
        .catch(error => {
            res.redirect(`/error?error=${error}`)
        })
})

// *********** *********** *********** //
//  Export Router                      //
// *********** *********** *********** //

module.exports = router
