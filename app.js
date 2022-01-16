const express = require('express');
const app = express();
const routes = require('./routes/index');
const bodyParser = require('body-parser')
const port = 3001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/', routes);

app.listen(port, () => {
    console.log(`Server listening on port ${port}...`)
});
