require('dotenv').config();
const connectToCluster = require("./database/mongodb");
const express = require('express');
const app = express();
const userRoutes = require('./routes/index');
const patientRoutes = require('./routes/patient');
const doctorRoutes = require('./routes/doctor');
const adminRoutes = require('./routes/admin');
const immigrationOfficialRoutes = require('./routes/immigrationOfficial');
const healthOfficialRoutes = require('./routes/healthOfficial');
const notificationRoutes = require('./routes/notification');
const bodyParser = require('body-parser')
const port = 3001;
let colors = require('colors');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/user', userRoutes);
app.use('/patient', patientRoutes);
app.use('/doctor', doctorRoutes);
app.use('/admin', adminRoutes);
app.use('/immigration-official', immigrationOfficialRoutes);
app.use('/health-official', healthOfficialRoutes);
app.use('/notification', notificationRoutes);

connectToCluster(process.env.MONGO_CLUSTER_URL).then(client => {
    app.locals.mongodb = client
})

app.listen(port, () => {
    // export const mongoClient = connectToCluster(process.env.MONGO_CLUSTER_URL).then(() => {
    //     console.log("success...".america);
    // });
    console.log(`Server listening on port ${port}...`.brightBlue)
});
