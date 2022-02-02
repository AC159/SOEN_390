require('dotenv').config()
const connectToCluster = require("./database/mongodb");
const express = require('express');
const app = express();
const routes = require('./routes/index');
const bodyParser = require('body-parser')
const port = 3001;
let colors = require('colors');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/', routes);

connectToCluster(process.env.MONGO_CLUSTER_URL).then(client => {
    app.locals.mongodb = client
})

app.listen(port, () => {
    // export const mongoClient = connectToCluster(process.env.MONGO_CLUSTER_URL).then(() => {
    //     console.log("success...".america);
    // });
    console.log(`Server listening on port ${port}...`.brightBlue)
});
