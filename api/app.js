const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./config/database');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

sequelize.sync({ force: true })
  .then(() => {
    console.log(`Database & tables created!`);
  });

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Hello from Express!' });
});

module.exports = app;