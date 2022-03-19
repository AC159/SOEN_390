require('dotenv').config();
const connectToCluster = require('./database/mongodb');
const express = require('express');
const app = express();
const userRoutes = require('./routes/index');
const patientRoutes = require('./routes/patient');
const doctorRoutes = require('./routes/doctor');
const adminRoutes = require('./routes/admin');
const immigrationOfficialRoutes = require('./routes/immigrationOfficial');
const healthOfficialRoutes = require('./routes/healthOfficial');
const notificationRoutes = require('./routes/notification');
const bodyParser = require('body-parser');
const port = 3001;
const socketio = require('socket.io');
require('colors');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/user', userRoutes);
app.use('/patient', patientRoutes);
app.use('/doctor', doctorRoutes);
app.use('/admin', adminRoutes);
app.use('/immigration-official', immigrationOfficialRoutes);
app.use('/health-official', healthOfficialRoutes);
app.use('/notification', notificationRoutes);

connectToCluster(process.env.MONGO_CLUSTER_URL).then((client) => {
  app.locals.mongodb = client;
});

const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}...`.brightBlue);
});

const io = socketio(server);

io.on("connection", (socket) => {
  console.log(`New websocket connection with socket id ${socket.id}`.magenta);

  socket.on('join-chat-room', (chatId) => {
    socket.join(chatId);
  })

  socket.on('private-message', async (msg) => {
    console.log('Received message from client: ', msg);
    // save the message in the database
    msg.timestamp = Math.floor(Date.now() / 1000);
    await app.locals.mongodb.db('test').collection('chats').insertOne(msg);
    socket.to(msg.chatId).emit('private-message', msg);
  });

  socket.on('disconnect', () => {
    console.log(`Websocket disconnected`.blue);
  });
});

process.on('exit', () => {
  server.close();
});

process.on('SIGTERM', () => {
  server.close();
});

module.exports = app;
module.exports.server = server;
