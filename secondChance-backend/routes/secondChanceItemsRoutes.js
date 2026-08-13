/*jshint esversion: 8 */
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { ObjectId } = require('mongodb'); // 1️⃣ استدعاء ObjectId من مكتبة MongoDB
const router = express.Router();
const connectToDatabase = require('../models/db');
const logger = require('../logger');

// Define the upload directory path
const directoryPath = 'public/images';

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, directoryPath);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// Get all secondChanceItems
router.get('/', async (req, res, next) => {
    logger.info('/ called');
    try {
        const db = await connectToDatabase();
        const collection = db.collection("gifts");
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
        const db = await connectToDatabase();
        const collection = db.collection("gifts");

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
        const db = await connectToDatabase();
        const collection = db.collection("gifts");
        const idParam = req.params.id;

        // تجهيز مصفوفة البحث لتشمل id العادي، و ObjectId الخاص بـ MongoDB
        const queryConditions = [
            { id: idParam },
            { id: parseInt(idParam) || -1 },
            { _id: idParam }
        ];

        if (ObjectId.isValid(idParam)) {
            queryConditions.push({ _id: new ObjectId(idParam) });
        }

        const secondChanceItem = await collection.findOne({
            $or: queryConditions
        });

        if (!secondChanceItem) {
            logger.error(`Item not found for id: ${idParam}`);
            return res.status(404).json({ error: "Item not found" });
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
        const db = await connectToDatabase();
        const collection = db.collection("gifts");
        const idParam = req.params.id;

        const queryConditions = [
            { id: idParam },
            { id: parseInt(idParam) || -1 },
            { _id: idParam }
        ];

        if (ObjectId.isValid(idParam)) {
            queryConditions.push({ _id: new ObjectId(idParam) });
        }

        const secondChanceItem = await collection.findOne({
            $or: queryConditions
        });

        if (!secondChanceItem) {
            logger.error('Item not found for update');
            return res.status(404).json({ error: "Item not found" });
        }

        secondChanceItem.category = req.body.category || secondChanceItem.category;
        secondChanceItem.condition = req.body.condition || secondChanceItem.condition;
        secondChanceItem.age_days = req.body.age_days || secondChanceItem.age_days;
        secondChanceItem.description = req.body.description || secondChanceItem.description;
        secondChanceItem.age_years = Number((secondChanceItem.age_days / 365).toFixed(1));

        const updateResult = await collection.updateOne(
            { _id: secondChanceItem._id },
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
        const db = await connectToDatabase();
        const collection = db.collection("gifts");
        const idParam = req.params.id;

        const queryConditions = [
            { id: idParam },
            { id: parseInt(idParam) || -1 },
            { _id: idParam }
        ];

        if (ObjectId.isValid(idParam)) {
            queryConditions.push({ _id: new ObjectId(idParam) });
        }

        const secondChanceItem = await collection.findOne({
            $or: queryConditions
        });

        if (!secondChanceItem) {
            logger.error('Item not found for deletion');
            return res.status(404).json({ error: "Item not found" });
        }

        await collection.deleteOne({ _id: secondChanceItem._id });
        res.json({ status: "deleted" });
    } catch (e) {
        logger.error('Error deleting item', e);
        next(e);
    }
});

module.exports = router;