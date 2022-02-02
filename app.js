require('dotenv').config()
const connectToCluster = require("./database/mongodb");
const express = require('express');
const app = express();
const routes = require('./routes/index');
const bodyParser = require('body-parser')
let colors = require('colors');

app.locals.port = 3001;
app.use(bodyParser.json());

connectToCluster(process.env.MONGO_CLUSTER_URL).then(client => {
    app.locals.mongodb = client;
});

app.use(bodyParser.urlencoded({extended: false}));

app.use('/', routes);

app.listen(app.locals.port, () => {
    console.log(`Server listening on port ${app.locals.port}...`.brightBlue)
});
