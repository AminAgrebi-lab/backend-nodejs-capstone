#!/bin/bash

echo "🚀 Starting environment restoration..."

# 1. إعداد ملف .env للـ Backend
echo "📝 Configuring Backend .env..."
cat << 'EON' > /home/project/backend-nodejs-capstone/secondChance-backend/.env
MONGO_URL=mongodb://root:8dBn1H1r0wUMVLnbQYl6OtlG@172.21.73.132:27017
MONGO_DB_NAME=secondChance
JWT_SECRET=secret_key
EON

# 2. إعداد ملف .env للـ Frontend
echo "📝 Configuring Frontend .env..."
echo "REACT_APP_BACKEND_URL=https://amynalqrby4-3060.theiadockernext-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai" > /home/project/backend-nodejs-capstone/secondChance-frontend/.env
cp /home/project/backend-nodejs-capstone/secondChance-frontend/.env /home/project/backend-nodejs-capstone/secondChance-frontend/.env.backup

# 3. استعادة بيانات البضائع والحسابات في MongoDB
echo "📦 Restoring items & registering test user into Database..."
cd /home/project/backend-nodejs-capstone/secondChance-backend
node -e '
const connectToDatabase = require("./models/db");
const fs = require("fs");

(async () => {
    try {
        const db = await connectToDatabase();
        
        // استعادة المنتجات
        const rawData = fs.readFileSync("./util/import-mongo/secondChanceItems.json");
        const parsed = JSON.parse(rawData);
        const items = Array.isArray(parsed) ? parsed : (parsed.items || parsed.target || Object.values(parsed)[0]);
        await db.collection("secondChanceItems").deleteMany({});
        await db.collection("gifts").deleteMany({});
        await db.collection("secondChanceItems").insertMany(items);
        await db.collection("gifts").insertMany(items);
        console.log("✅ Items imported successfully!");

        // إنشاء أو تحديث المستخدم التجريبي (Lachie)
        const sampleUser = {
            email: "lachie@gmail.com",
            firstName: "Lachie",
            lastName: "User",
            password: "$2a$10$e88yR6j0hFfUvYx/.NqL/OQdO8eCgXqM3nKj6P3S5mZqA9xPzL2iC", // "lac123" hashed
            createdAt: new Date()
        };
        await db.collection("users").updateOne(
            { email: "lachie@gmail.com" },
            { $set: sampleUser },
            { upsert: true }
        );
        console.log("✅ Test user lachie@gmail.com registered successfully!");

    } catch (e) {
        console.error("Error during DB initialization:", e.message);
    }
    process.exit(0);
})();'

echo "🎉 Everything restored successfully!"
