require('dotenv').config();
const {connectToCluster} = require('./database/mongodb');
const cors = require('cors');
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
const createWebSocketConnection = require('./WebSockets/socketIO');
const path = require('path');
const port = process.env.PORT || 3001;
const socketio = require('socket.io');
require('colors');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/user', userRoutes);
app.use('/patient', patientRoutes);
app.use('/doctor', doctorRoutes);
app.use('/admin', adminRoutes);
app.use('/immigration-official', immigrationOfficialRoutes);
app.use('/health-official', healthOfficialRoutes);
app.use('/notification', notificationRoutes);

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'frontend/build')));
  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
  });
}

const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}...`.brightBlue);
});

connectToCluster(process.env.MONGO_CLUSTER_URL).then((client) => {
  app.locals.mongodb = client;
  createWebSocketConnection(client, server);
});

process.on('exit', () => {
  server.close();
});

process.on('SIGTERM', () => {
  server.close();
});

module.exports = app;
module.exports.server = server;
