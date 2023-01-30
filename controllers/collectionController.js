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
    const fullArray = []
    // pull cards from mtg api with multiple axios calls
    // because the api limits to 100 calls at a time
    // and many card sets have >100 cards

    // TODO implement ability to define set(s) via list boxes on the front end
    // will probably need to create an array of sets
    // and for each set make these axios calls???????

    const redReq = axios.get(`${process.env.MTG_URL}?set=4ED&colors=R`)
    const blueReq = axios.get(`${process.env.MTG_URL}?set=4ED&colors=U`)
    const greenReq = axios.get(`${process.env.MTG_URL}?set=4ED&colors=G`)
    const whiteReq = axios.get(`${process.env.MTG_URL}?set=4ED&colors=W`)
    const blackReq = axios.get(`${process.env.MTG_URL}?set=4ED&colors=B`)
    const landReq = axios.get(`${process.env.MTG_URL}?set=4ED&types=Land`)
    const artifactReq = axios.get(
        `${process.env.MTG_URL}?set=4ED&types=Artifact`
    )

    await Promise.all([
        redReq,
        blueReq,
        greenReq,
        whiteReq,
        blackReq,
        landReq,
        artifactReq,
    ])
        .then(allData => {
            // TODO somewhere in here, check for duplicate cards
            allData.forEach(chunk => {
                return fullArray.push(chunk.data.cards)
            })
            // console.log('full array:', fullArray.flat())
        })
        .then(() => {
            // console.log(fullArray.flat())
            const flatArray = fullArray.flat()
            const cardArray = flatArray.map(card => {
                return {
                    name: card.name,
                    mtgId: card.id,
                    image: card.imageUrl,
                    count: 1,
                }
            })
            req.body.cards = cardArray
            console.log(req.body)
        })
        .then(() => {
            // TODO implemet collection pages (ala decks)
            // so many collections can be created
            Collection.create(req.body)
                .then(collection => {
                    // if collection name already exists, throw an erro
                    console.log(
                        `this was returned from collection${collection}`
                    )
                    // else, create the collection and redirect to the collection view page
                })
                .catch(error => {
                    res.redirect(`/error?error=${error}`)
                })
        })
        .catch(err => {
            res.redirect(`/error?error=${err}`)
        })

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
