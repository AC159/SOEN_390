require('dotenv').config()
const connectToCluster = require("./database/mongodb");
const express = require('express');
const app = express();
const routes = require('./routes/index');
const bodyParser = require('body-parser')
const port = 3001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/', routes);

app.listen(port, () => {
    const mongoClient = connectToCluster(process.env.MONGO_CLUSTER_URL).then(r => console.log("success..."));
    console.log(`Server listening on port ${port}...`)
});
