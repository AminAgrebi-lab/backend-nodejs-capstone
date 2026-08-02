const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const connectToDatabase = require('../models/db');
const logger = require('../logger');

// Define the upload directory path
const directoryPath = 'public/images';

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, directoryPath); // Specify the upload directory
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original file name
  },
});

const upload = multer({ storage: storage });

// Get all secondChanceItems
router.get('/', async (req, res, next) => {
    logger.info('/ called');
    try {
        // Step 2: Connect to MongoDB and fetch items
        const db = await connectToDatabase();
        const collection = db.collection("secondChanceItems");
        const secondChanceItems = await collection.find({}).toArray();
        res.json(secondChanceItems);
    } catch (e) {
        logger.error('oops something went wrong', e);
        next(e);
    }
});

// Add a new item
router.post('/', upload.single('file'), async (req, res, next) => {
    try {
        // Step 3: Add new item to database
        const db = await connectToDatabase();
        const collection = db.collection("secondChanceItems");

        let secondChanceItem = req.body;
        
        // Calculate new item ID
        const lastItem = await collection.find().sort({ id: -1 }).limit(1).toArray();
        if (lastItem.length > 0) {
            secondChanceItem.id = (parseInt(lastItem[0].id) + 1).toString();
        } else {
            secondChanceItem.id = "1";
        }

        const date_added = Math.floor(new Date().getTime() / 1000);
        secondChanceItem.date_added = date_added;

        if (req.file) {
            secondChanceItem.image = `/images/${req.file.filename}`;
        }

        const result = await collection.insertOne(secondChanceItem);
        res.status(201).json(result);
    } catch (e) {
        logger.error('Error adding new item', e);
        next(e);
    }
});

// Get a single secondChanceItem by ID
router.get('/:id', async (req, res, next) => {
    try {
        // Step 4: Fetch single item by ID
        const db = await connectToDatabase();
        const collection = db.collection("secondChanceItems");
        const id = req.params.id;

        const secondChanceItem = await collection.findOne({ id: id });

        if (!secondChanceItem) {
            return res.status(404).send("Item not found");
        }

        res.json(secondChanceItem);
    } catch (e) {
        logger.error('Error fetching item details', e);
        next(e);
    }
});

// Update an existing item
router.put('/:id', async (req, res, next) => {
    try {
        // Step 5: Update item by ID
        const db = await connectToDatabase();
        const collection = db.collection("secondChanceItems");
        const id = req.params.id;

        const secondChanceItem = await collection.findOne({ id: id });

        if (!secondChanceItem) {
            logger.error('Item not found for update');
            return res.status(404).send("Item not found");
        }

        secondChanceItem.category = req.body.category || secondChanceItem.category;
        secondChanceItem.condition = req.body.condition || secondChanceItem.condition;
        secondChanceItem.age_days = req.body.age_days || secondChanceItem.age_days;
        secondChanceItem.description = req.body.description || secondChanceItem.description;
        secondChanceItem.age_years = Number((secondChanceItem.age_days / 365).toFixed(1));

        const updateResult = await collection.updateOne(
            { id: id },
            { $set: secondChanceItem }
        );

        res.json({ status: "success", updateResult });
    } catch (e) {
        logger.error('Error updating item', e);
        next(e);
    }
});

// Delete an existing item
router.delete('/:id', async (req, res, next) => {
    try {
        // Step 6: Delete item by ID
        const db = await connectToDatabase();
        const collection = db.collection("secondChanceItems");
        const id = req.params.id;

        const secondChanceItem = await collection.findOne({ id: id });

        if (!secondChanceItem) {
            logger.error('Item not found for deletion');
            return res.status(404).send("Item not found");
        }

        await collection.deleteOne({ id: id });
        res.json({ status: "deleted" });
    } catch (e) {
        logger.error('Error deleting item', e);
        next(e);
    }
});

module.exports = router;