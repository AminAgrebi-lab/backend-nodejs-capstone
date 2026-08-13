/*jshint esversion: 8 */
const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const connectToDatabase = require('../models/db');
const logger = require('../logger');

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key';

// -------------------------------------------------------------
// POST /register endpoint
// -------------------------------------------------------------
router.post('/register', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection("users");

        const existingEmail = await collection.findOne({ email: req.body.email });
        if (existingEmail) {
            logger.error('Email id already exists');
            return res.status(400).json({ error: 'Email id already exists' });
        }

        const salt = await bcryptjs.genSalt(10);
        const hash = await bcryptjs.hash(req.body.password, salt);

        const newUser = await collection.insertOne({
            email: req.body.email,
            firstName: req.body.firstName || req.body.name,
            lastName: req.body.lastName || '',
            password: hash,
            createdAt: new Date(),
        });

        const payload = {
            user: {
                id: newUser.insertedId,
            },
        };
        const authtoken = jwt.sign(payload, JWT_SECRET);

        logger.info('User registered successfully');
        const email = req.body.email;
        return res.json({ authtoken, email });

    } catch (e) {
        logger.error(`Internal server error: ${e}`);
        return res.status(500).send('Internal server error');
    }
});

// -------------------------------------------------------------
// POST /login endpoint
// -------------------------------------------------------------
router.post('/login', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection("users");

        const theUser = await collection.findOne({ email: req.body.email });

        if (theUser) {
            let result = await bcryptjs.compare(req.body.password, theUser.password);
            if (!result) {
                logger.error('Passwords do not match');
                return res.status(404).json({ error: 'Wrong password' });
            }

            const userName = theUser.firstName || theUser.name || theUser.email;
            const userEmail = theUser.email;

            let payload = {
                user: {
                    id: theUser._id.toString(),
                },
            };
            const authtoken = jwt.sign(payload, JWT_SECRET);

            logger.info('User logged in successfully');
            return res.json({ authtoken, userName, userEmail });

        } else {
            logger.error('User not found');
            return res.status(404).json({ error: 'User not found' });
        }

    } catch (e) {
        logger.error(`Internal server error: ${e}`);
        return res.status(500).send('Internal server error');
    }
});

// -------------------------------------------------------------
// PUT /update endpoint
// -------------------------------------------------------------
router.put('/update', async (req, res) => {
    try {
        // استخراج الإيميل سواء كان من الـ headers أو الـ body
        const email = req.headers.email || req.body.email;
        
        if (!email) {
            logger.error('Email not found in the request headers or body');
            return res.status(400).json({ error: "Email not found in request" });
        }

        const db = await connectToDatabase();
        const collection = db.collection("users");

        const existingUser = await collection.findOne({ email });

        if (!existingUser) {
            logger.error('User not found for update');
            return res.status(404).json({ error: "User not found" });
        }

        // تحديث الاسم بشكل يدعم name أو firstName/lastName
        if (req.body.name) {
            existingUser.firstName = req.body.name;
            existingUser.name = req.body.name;
        }
        if (req.body.firstName) {
            existingUser.firstName = req.body.firstName;
        }
        if (req.body.lastName) {
            existingUser.lastName = req.body.lastName;
        }

        existingUser.updatedAt = new Date();

        // تحديث البيانات في قاعدة البيانات
        await collection.updateOne(
            { email },
            { $set: existingUser }
        );

        const updatedUser = await collection.findOne({ email });

        const payload = {
            user: {
                id: updatedUser._id.toString(),
            },
        };

        const authtoken = jwt.sign(payload, JWT_SECRET);
        const userName = updatedUser.firstName || updatedUser.name;

        logger.info('User updated successfully');
        return res.json({ authtoken, userName, userEmail: email });

    } catch (e) {
        logger.error(`Internal server error during update: ${e}`);
        return res.status(500).send('Internal server error');
    }
});

module.exports = router;