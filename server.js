// npm i --save-dev nodemon
// npm run devStart
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require("cors");

const routes = require('./routes');
const express = require("express");
require("dotenv").config();
const app = express();

app.use(bodyParser.json());

// Use cors middleware correctly
app.use(cors());

app.use('/', routes);

// Update the MongoDB connection string
mongoose.connect('mongodb://0.0.0.0:27017/User', { useNewUrlParser: true });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function () {
    console.log('Database connected Successfully');
});

app.listen(3000, () => console.log("Server Started on port 3000"));
