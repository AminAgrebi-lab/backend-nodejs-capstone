/* jshint esversion: 8 */
const express = require('express')
const multer = require('multer')
const router = express.Router()
const connectToDatabase = require('../models/db')
const logger = require('../logger')

// Define storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

const upload = multer({ storage })

// Get all secondChance items
router.get('/', async (req, res, next) => {
  logger.info('fetching all secondChance items')
  try {
    const db = await connectToDatabase()
    const collection = db.collection('secondChanceItems')
    const secondChanceItems = await collection.find({}).toArray()
    res.json(secondChanceItems)
  } catch (e) {
    logger.error('oops something went wrong', e)
    next(e)
  }
})

// Add a new item
router.post('/', upload.single('file'), async (req, res, next) => {
  try {
    const db = await connectToDatabase()
    const collection = db.collection('secondChanceItems')

    const lastItem = await collection.find().sort({ id: -1 }).limit(1).toArray()
    let newId = 1
    if (lastItem.length > 0) {
      newId = parseInt(lastItem[0].id) + 1
    }

    let secondChanceItem = req.body
    secondChanceItem.id = newId.toString()
    secondChanceItem.dateAdded = Math.floor(Date.now() / 1000)

    if (req.file) {
      secondChanceItem.image = `/images/${req.file.filename}`
    }

    const result = await collection.insertOne(secondChanceItem)
    res.status(201).json(result)
  } catch (e) {
    logger.error('oops something went wrong', e)
    next(e)
  }
})

// Get a single secondChance item by ID
router.get('/:id', async (req, res, next) => {
  try {
    const db = await connectToDatabase()
    const collection = db.collection('secondChanceItems')
    const id = req.params.id

    const secondChanceItem = await collection.findOne({ id })

    if (!secondChanceItem) {
      return res.status(404).send('secondChanceItem not found')
    }

    res.json(secondChanceItem)
  } catch (e) {
    logger.error('oops something went wrong', e)
    next(e)
  }
})

// Update an existing item
router.put('/:id', async (req, res, next) => {
  try {
    const db = await connectToDatabase()
    const collection = db.collection('secondChanceItems')
    const id = req.params.id

    const secondChanceItem = await collection.findOne({ id })

    if (!secondChanceItem) {
      return res.status(404).send('secondChanceItem not found')
    }

    secondChanceItem.category = req.body.category
    secondChanceItem.condition = req.body.condition
    secondChanceItem.ageDays = req.body.ageDays
    secondChanceItem.description = req.body.description
    secondChanceItem.ageYears = req.body.ageYears
    secondChanceItem.updatedAt = new Date()

    const updateResult = await collection.save(secondChanceItem)

    if (updateResult) {
      res.json({ status: 'success' })
    } else {
      res.status(400).send('Failed to update')
    }
  } catch (e) {
    logger.error('oops something went wrong', e)
    next(e)
  }
})

// Delete a secondChance item
router.delete('/:id', async (req, res, next) => {
  try {
    const db = await connectToDatabase()
    const collection = db.collection('secondChanceItems')
    const id = req.params.id

    const secondChanceItem = await collection.findOne({ id })

    if (!secondChanceItem) {
      return res.status(404).send('secondChanceItem not found')
    }

    await collection.deleteOne({ id })
    res.json({ status: 'success' })
  } catch (e) {
    logger.error('oops something went wrong', e)
    next(e)
  }
})

module.exports = router