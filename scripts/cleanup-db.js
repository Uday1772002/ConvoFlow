// Script to clean up unused MongoDB collections
const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.DATABASE_URL;

async function cleanupDatabase() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    
    const db = mongoose.connection.db;
    
    // Get all collections
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    console.log('📊 Current collections:', collectionNames);
    
    // Collections to remove (unused)
    const unusedCollections = ['sessions', 'accounts', 'conversationparticipants'];
    
    // Drop unused collections
    for (const collectionName of unusedCollections) {
      if (collectionNames.includes(collectionName)) {
        await db.dropCollection(collectionName);
        console.log(`✅ Dropped collection: ${collectionName}`);
      } else {
        console.log(`⏭️  Collection not found (already removed): ${collectionName}`);
      }
    }
    
    // List remaining collections
    const remainingCollections = await db.listCollections().toArray();
    console.log('\n📦 Remaining collections:', remainingCollections.map(c => c.name));
    
    console.log('\n✨ Database cleanup complete!');
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error cleaning up database:', error);
    process.exit(1);
  }
}

cleanupDatabase();
