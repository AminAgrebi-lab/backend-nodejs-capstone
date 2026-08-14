const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

const url = process.env.MONGO_URL || 'mongodb://localhost:27017';
const dbName = process.env.MONGO_DB || 'secondChance';
const collectionName = process.env.MONGO_COLLECTION || 'secondChanceItems';

async function loadData() {
  const client = new MongoClient(url);
  try {
    await client.connect();
    console.log('Connected successfully to server');
    
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // قراءة ملف JSON
    const filePath = path.join(__dirname, 'secondChanceItems.json');
    const rawData = fs.readFileSync(filePath, 'utf8');
    const parsedData = JSON.parse(rawData);

    // التحقق من أن البيانات مصفوفة، وإذا كانت كائناً نستخرج المصفوفة من داخله
    let itemsToInsert = [];
    if (Array.isArray(parsedData)) {
      itemsToInsert = parsedData;
    } else if (typeof parsedData === 'object' && parsedData !== null) {
      const possibleArray = parsedData.secondChanceItems || parsedData.items || Object.values(parsedData)[0];
      if (Array.isArray(possibleArray)) {
        itemsToInsert = possibleArray;
      } else {
        itemsToInsert = [parsedData];
      }
    }

    if (itemsToInsert.length === 0) {
      console.log('No items found to insert.');
      return;
    }

    const insertResult = await collection.insertMany(itemsToInsert);
    console.log(`${insertResult.insertedCount} documents were inserted successfully!`);
  } catch (err) {
    console.error('Error inserting documents:', err);
  } finally {
    await client.close();
  }
}

loadData();