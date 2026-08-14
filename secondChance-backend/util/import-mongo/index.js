require('dotenv').config()
const MongoClient = require('mongodb').MongoClient
const path = require('path')
const fs = require('fs')

// MongoDB connection URL
const url = process.env.MONGO_URL
const filename = path.join(__dirname, 'secondChanceItems.json')
const dbName = 'secondChance'
const collectionName = 'secondChanceItems'

// insert seed data
const sampleData = JSON.parse(fs.readFileSync(filename, 'utf8'))

async function loadData () {
  const client = new MongoClient(url)

  try {
    // Connect to the MongoDB server
    await client.connect()
    console.log('Connected successfully to server')

    // database and collection instances
    const db = client.db(dbName)
    const collection = db.collection(collectionName)

    // check if collection already exists
    const cursor = collection.find({})
    const documents = await cursor.toArray()

    if (documents.length === 0) {
      // insert sample data
      const insertResult = await collection.insertMany(sampleData)
      console.log('Inserted documents:', insertResult.insertedCount)
    } else {
      console.log('Items already exists in DB')
    }
  } catch (err) {
    console.error('Error inserting documents:', err)
  } finally {
    // Close the client connection
    await client.close()
  }
}

loadData()
