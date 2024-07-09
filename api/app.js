const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./config/database');
const homeRoutes = require('./routes/home');
const authRoutes = require('./routes/auth');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/', homeRoutes);
app.use('/auth', authRoutes);

sequelize.sync({ force: true })
.then(() => console.log('Database synced'))
.catch(err => console.error('Unable to sync database:', err));

module.exports = app;