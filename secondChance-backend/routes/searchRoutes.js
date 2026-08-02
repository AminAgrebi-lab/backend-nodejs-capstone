const express = require('express');
const router = express.Router();
const connectToDatabase = require('../models/db');

// Search for gifts / secondChanceItems
router.get('/', async (req, res, next) => {
    try {
        const db = await connectToDatabase();
        
        // فحص المجموعة المتاحة (سواء كانت secondChanceItems أو gifts)
        const collections = await db.listCollections().toArray();
        const collectionName = collections.some(c => c.name === 'secondChanceItems') 
            ? 'secondChanceItems' 
            : 'gifts';
            
        const collection = db.collection(collectionName);

        let query = {};

        // Task 2: Name filter (Case-insensitive)
        if (req.query.name && req.query.name.trim() !== '') {
            query.name = { $regex: req.query.name.trim(), $options: "i" };
        }

        // Task 3: Category filter (Case-insensitive)
        if (req.query.category && req.query.category.trim() !== '') {
            query.category = { $regex: req.query.category.trim(), $options: "i" };
        }

        // Task 3: Condition filter
        if (req.query.condition && req.query.condition.trim() !== '') {
            query.condition = req.query.condition;
        }

        // Task 3: Age filter
        if (req.query.age_years) {
            query.age_years = { $lte: parseInt(req.query.age_years) };
        }

        // Task 4: Fetch items
        const gifts = await collection.find(query).toArray();
        res.json(gifts);

    } catch (e) {
        next(e);
    }
});

module.exports = router;