#!/bin/bash

echo "🚀 Starting environment restoration..."

# 1. إعداد ملف .env للـ Backend
echo "📝 Configuring Backend .env..."
cat << 'EON' > /home/project/backend-nodejs-capstone/secondChance-backend/.env
MONGO_URL=mongodb://root:nGovdz3rmMEM6yqnE123Uo5D@172.21.140.13:27017
MONGO_DB_NAME=secondChance
JWT_SECRET=secret_key
EON

# 2. إعداد ملف .env للـ Frontend
echo "📝 Configuring Frontend .env..."
echo "REACT_APP_BACKEND_URL=https://amynalqrby4-3060.theiadockernext-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai" > /home/project/backend-nodejs-capstone/secondChance-frontend/.env
cp /home/project/backend-nodejs-capstone/secondChance-frontend/.env /home/project/backend-nodejs-capstone/secondChance-frontend/.env.backup

# 3. استعادة بيانات البضائع في MongoDB
echo "📦 Restoring items into Database..."
cd /home/project/backend-nodejs-capstone/secondChance-backend
node -e '
const connectToDatabase = require("./models/db");
const fs = require("fs");
(async () => {
    try {
        const db = await connectToDatabase();
        await db.dropDatabase();
        const rawData = fs.readFileSync("./util/import-mongo/secondChanceItems.json");
        const parsed = JSON.parse(rawData);
        const items = Array.isArray(parsed) ? parsed : (parsed.items || parsed.target || Object.values(parsed)[0]);
        await db.collection("secondChanceItems").insertMany(items);
        await db.collection("gifts").insertMany(items);
        console.log("✅ Items imported successfully!");
    } catch (e) {
        console.error("Error importing items:", e.message);
    }
    process.exit(0);
})();'

# 4. تسجيل المستخدم التجريبي تلقائياً (Lachie)
echo "👤 Registering test user (Lachie)..."
node -e '
const connectToDatabase = require("./models/db");
const bcrypt = require("bcryptjs");
(async () => {
    try {
        const db = await connectToDatabase();
        const hashPassword = await bcrypt.hash("lac123", 10);
        await db.collection("users").updateOne(
            { email: "lachie@gmail.com" },
            { $set: { firstName: "Lachie", lastName: "User", email: "lachie@gmail.com", password: hashPassword } },
            { upsert: true }
        );
        console.log("✅ User lachie@gmail.com registered/verified successfully!");
    } catch (e) {
        console.error("Error creating user:", e.message);
    }
    process.exit(0);
})();'

echo "🎉 Everything restored successfully!"
