const express  = require('express');
require("dotenv").config();
const cookieParser = require('cookie-parser');
const  userRoutes  =  require('./routes/userRoute');
const cors = require('cors');
const corsOptions = require('./config/cors');
const session = require('express-session');


const PORT = process.env.PORT;

const app = express()

app.use(cors(corsOptions));
// middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.use(session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
        path: '/', // chemin d'autorisation pour le cookie
        domain: 'localhost', // domaine autorisé pour le cookie
        httpOnly: true, // empèche l'accès au cookie avec js dans le nav
        secure: false, // true seulement quand https
        sameSite: 'Strict'
    }
}));


// routes user API
app.use('/api/users', userRoutes);

app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
