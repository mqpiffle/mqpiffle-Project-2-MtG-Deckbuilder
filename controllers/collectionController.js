// *********** *********** *********** //
//  Dependencies                       //
// *********** *********** *********** //
const express = require('express')
const Collection = require('../models/collection')
const axios = require('axios')
require('dotenv').config()

// *********** *********** *********** //
//  Router                             //
// *********** *********** *********** //
const router = express.Router()

// *********** *********** *********** //
//  Routes                             //
// *********** *********** *********** //

router.get('/new', (req, res) => {
    // console.log(cards)
    res.render('collections/new', { ...req.session })
})

router.post('/', async (req, res) => {
    const cardArray = []

    // for testing, if there is a collection, delete the collection first
    const card = await axios(`${process.env.MTG_URL}?set=4ED&random=true`)
    req.body.cards = card.data.cards.map(card => {
        return {
            name: card.name,
            mtgId: card.id,
            image: card.imageUrl,
            count: 1,
        }
    })
    console.log(req.body)
    console.log(req.body.name)
    Collection.create(req.body)
        .then(collection => {
            console.log(`this was returned from collection${collection}`)
        })
        .catch(error => {
            res.redirect(`/error?error=${error}`)
        })
    // for now:
    // make chained axios calls because of 100 card limit
    // call lands, then push
    // call artifacts, check for duplicates, then push
    // call red cards, check for duplicates, then push
    // .....
    // then save
    // then redirect
    // handle errors
})

// *********** *********** *********** //
//  Export Router                      //
// *********** *********** *********** //
module.exports = router
