const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
require('colors');

async function connectToCluster(uri) {
  let mongoClient;
  try {
    mongoClient = new MongoClient(uri);
    console.log('Connecting to MongoDB Atlas cluster...'.brightYellow);
    await mongoClient.connect();
    console.log('Successfully connected to MongoDB Atlas!'.brightGreen);
    return mongoClient;
  } catch (error) {
    console.error('Connection to MongoDB Atlas failed!'.brightRed, error);
    process.exit();
  }
}

module.exports = connectToCluster;
