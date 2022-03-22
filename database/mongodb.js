const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
require('colors');

const DB = "test";
const COLLECTION = "socket.io-adapter-events";

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

module.exports.connectToCluster = connectToCluster;
module.exports.DB = DB;
module.exports.COLLECTION = COLLECTION;
