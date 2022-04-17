const socketIO = require('socket.io');
const {DB, COLLECTION} = require('../database/mongodb');
const {createAdapter} = require('@socket.io/mongo-adapter');

const createWebSocketConnection = (mongoClient, server) => {
  const io = socketIO(server);
  const mongoCollection = mongoClient.db(DB).collection(COLLECTION);
  io.adapter(createAdapter(mongoCollection));

  io.on('connection', (socket) => {
    console.log(`New websocket connection with socket id ${socket.id}`.magenta);

    socket.on('join-chat-room', (chatId) => {
      socket.join(chatId);
    });

    socket.on('private-message', async (msg) => {
      console.log('Received message from client: ', msg);
      // save the message in the database
      msg.timestamp = Math.floor(Date.now());
      await mongoClient.db('test').collection('chats').insertOne(msg);
      socket.to(msg.chatId).emit('private-message', msg);
    });

    socket.on('disconnect', () => {
      console.log(`Websocket disconnected`.blue);
    });
  });
};

module.exports = createWebSocketConnection;
