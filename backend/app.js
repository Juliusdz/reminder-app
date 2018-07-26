const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const remindersRoutes = require('./routes/reminders');
const userRoutes = require("./routes/user");

const emailCronJobs = require("./email-cron-jobs");

const app = express();

mongoose.connect('mongodb+srv://admin:' +
                process.env.MONGO_ATLAS_PW +
                '@cluster0-ncelx.mongodb.net/test', {useNewUrlParser: true}) // <- removed ?retryWrites=true (Mongoose bug)
  .then(() => {
    console.log('Database connected')
  }).catch(() => {
    console.log('Can not connect database!')
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false})); // for different kind of bodies

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/reminders", remindersRoutes);
app.use("/api/user", userRoutes);

app.listen(app.get('port'), () => {
  console.log('The server is running!');
  emailCronJobs.registerCronJobs()
});

module.exports = app;


