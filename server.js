const dotenv = require('dotenv');
const express = require('express');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const knex = require('knex');
const { check, validationResult } = require('express-validator');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

dotenv.config();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0; 

const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  }
});


const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes 
app.get('/', (req, res) => {
  res.send('api server is working');
});

app.post('/signin', signin.handleSignIn(db, bcrypt));

app.post('/register', [check('email').normalizeEmail().isEmail().isEmpty(), check('name').isEmpty(), check('password', 'The password must be 8+ characters long and contain a number')
.not()
.isEmpty()
.isIn(['123', 'password', 'god'])
.withMessage('Do not use a common word as the password')
.isLength({ min: 8 })
.matches(/\d/)], (req, res) => {register.handleRegister(req, res, db, bcrypt, validationResult)});

app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db)});

app.put('/image', (req, res) => {image.handleImage(req, res, db)} );
app.post('/imageurl', (req, res) => {image.handleAPICall(req, res)});

app.listen(process.env.PORT || 6969, () => {
  console.log(`🚀🚀🚀 App is runnin on port ${process.env.PORT} 🔥🔥🔥`);
});