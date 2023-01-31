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

// index ALL
router.get('/', (req, res) => {
    Collection.find({})
        .then(collections => {
            res.render('collections/index', { collections, ...req.session })
        })
        .catch(error => {
            res.redirect(`/error?error=${error}`)
        })
})

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
                chunk.data.cards.forEach(card => {
                    return fullArray.push(card)
                })
            })
            // console.log('full array:', fullArray)
        })
        // .then(allData => {
        //     console.log('this is allData: ', allData)
        //     // console.log(fullArray.flat())
        //     const flatArray = fullArray.flat()
        //     flatArray.map(card => {
        //         cardsArray.push({
        //             name: card.name,
        //             mtgId: card.id,
        //             image: card.imageUrl,
        //             count: 1,
        //         })
        //     })
        //     // console.log(req.body)
        // })
        .then(() => {
            // TODO implemet collection pages (ala decks)
            // so many collections can be created
            Collection.create(req.body)
                .then(collection => {
                    fullArray.map(card => {
                        collection.cards.push({
                            name: card.name,
                            mtgId: card.id,
                            image: card.imageUrl,
                            count: 1,
                        })
                    })
                    console.log('this is collection.cards: ', collection.cards)
                    return collection.save()
                    // if collection name already exists, throw an error
                    // else, create the collection and redirect to the collection view page
                })
                .then(() => {
                    res.redirect(`/collections`)
                })
                .catch(error => {
                    res.redirect(`/error?error=${error}`)
                })
        })
        .catch(err => {
            res.redirect(`/error?error=${err}`)
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

// edit route -> GET that takes us to the edit form view
router.get('/:id/edit', async (req, res) => {
    // we need to get the id
    const collectionId = req.params.id
    Collection.findById(collectionId)
        .then(collection => {
            res.render('collections/edit', {
                cards,
                collection,
                ...req.session,
            })
        })
        .catch(error => {
            res.redirect(`/error?error=${error}`)
        })
})

// edit route -> GET that takes us to the edit form view
router.get('/:id/edit-info', async (req, res) => {
    // we need to get the id
    const collectionId = req.params.id
    Collection.findById(collectionId)
        .then(collection => {
            res.render('collections/edit-info', { collection, ...req.session })
        })
        .catch(error => {
            res.redirect(`/error?error=${error}`)
        })
})

// update route
router.put('/:id', (req, res) => {
    const collectionId = req.params.id

    Collection.findByIdAndUpdate(collectionId, req.body, { new: true })
        .then(collection => {
            res.redirect(`/collections/${collection.id}/edit`)
        })
        .catch(error => {
            res.redirect(`/error?error=${error}`)
        })
})

// show route
router.get('/:id', (req, res) => {
    const id = req.params.id
    Collection.findById(id)
        .then(collection => {
            res.render('collections/show', { collection, ...req.session })
        })
        .catch(error => {
            res.redirect(`/error?error=${error}`)
        })
})

// delete route
router.delete('/:id', (req, res) => {
    const collectionId = req.params.id
    Collection.findByIdAndRemove(collectionId)
        .then(() => {
            res.redirect('/collections')
        })
        .catch(error => {
            res.redirect(`/error?error=${error}`)
        })
})

// *********** *********** *********** //
//  Export Router                      //
// *********** *********** *********** //
module.exports = router
