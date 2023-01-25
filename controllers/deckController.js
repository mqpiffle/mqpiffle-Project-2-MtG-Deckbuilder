// Import Dependencies
const express = require('express')
const Deck = require('../models/deck')
const axios = require('axios')
require('dotenv').config()

// Create router
const router = express.Router()

// Router Middleware
// Authorization middleware
// If you have some resources that should be accessible to everyone regardless of loggedIn status, this middleware can be moved, commented out, or deleted.
router.use((req, res, next) => {
    // checking the loggedIn boolean of our session
    if (req.session.loggedIn) {
        // if they're logged in, go to the next thing(thats the controller)
        next()
    } else {
        // if they're not logged in, send them to the login page
        res.redirect('/auth/login')
    }
})

// Routes

// index ALL
router.get('/', (req, res) => {
    Deck.find({})
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
    Deck.find({ owner: userId })
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
router.get('/new', async (req, res) => {
    const setsArray = ['4ED']
    const cards = await axios(`${process.env.MTG_URL}?set=4ED`)
    console.log(cards.data)
    // cards returns an object as data which includes one element
    // and array of cards
    // need to drill down into that array to access the properties needed
    cardData = cards.data
    const cardInfo = cardData.cards.map(card => {
        return { image: card.imageUrl, id: card.id }
    })
    console.log(cardInfo)
    res.render('decks/new', { ...cardInfo, ...req.session })
})

// create -> POST route that actually calls the db and makes a new document
router.post('/', (req, res) => {
    req.body.ready = req.body.ready === 'on' ? true : false

    req.body.owner = req.session.userId
    Deck.create(req.body)
        .then(deck => {
            console.log('this was returned from create', deck)
            res.redirect('/decks')
        })
        .catch(error => {
            res.redirect(`/error?error=${error}`)
        })
})

// edit route -> GET that takes us to the edit form view
router.get('/:id/edit', (req, res) => {
    // we need to get the id
    const deckId = req.params.id
    Deck.findById(deckId)
        .then(deck => {
            res.render('deck/edit', { deck })
        })
        .catch(error => {
            res.redirect(`/error?error=${error}`)
        })
})

// update route
router.put('/:id', (req, res) => {
    const deckId = req.params.id
    req.body.ready = req.body.ready === 'on' ? true : false

    Deck.findByIdAndUpdate(deckId, req.body, { new: true })
        .then(deck => {
            res.redirect(`/decks/${deck.id}`)
        })
        .catch(error => {
            res.redirect(`/error?error=${error}`)
        })
})

// show route
router.get('/:id', (req, res) => {
    const deckId = req.params.id
    Deck.findById(deckId)
        .then(deck => {
            const { username, loggedIn, userId } = req.session
            res.render('decks/show', { deck, username, loggedIn, userId })
        })
        .catch(error => {
            res.redirect(`/error?error=${error}`)
        })
})

// delete route
router.delete('/:id', (req, res) => {
    const deckId = req.params.id
    Deck.findByIdAndRemove(deckId)
        .then(deck => {
            res.redirect('/decks')
        })
        .catch(error => {
            res.redirect(`/error?error=${error}`)
        })
})

// Export the Router
module.exports = router
