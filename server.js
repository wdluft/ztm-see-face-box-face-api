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
const leaderboard = require('./controllers/leaderboard');

dotenv.config();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  },
});

const app = express();

// =============================
// Middleware
// =============================
app.use(express.json());
app.use(cors());

// =============================
// Routes
// =============================
app.get('/', (req, res) => {
  res.send('api server is working');
});

// Sign in user
app.post(
  '/signin',
  [
    check('email')
      .normalizeEmail()
      .isEmail()
      .withMessage('Must use a valid email')
      .not()
      .isEmpty()
      .withMessage('Email cannot be blank'),
    check('password').not().isEmpty().withMessage('Password cannot be blank'),
  ],
  signin.handleSignIn(db, bcrypt, validationResult)
);

// Register user
app.post(
  '/register',
  [
    check('name').not().isEmpty().withMessage('Name cannot be blank'),
    check('email')
      .normalizeEmail()
      .isEmail()
      .withMessage('Must use a valid email')
      .not()
      .isEmpty()
      .withMessage('Email cannot be blank'),

    check('password')
      .isLength({ min: 8 })
      .withMessage('Password must be 8+ characters long')
      .matches(/\d/)
      .withMessage('Password must contain a number'),
  ],
  (req, res) => {
    register.handleRegister(req, res, db, bcrypt, validationResult);
  }
);

// Get profile
app.get('/profile/:id', (req, res) => {
  profile.handleProfileGet(req, res, db);
});

// Update entries
app.put('/image', (req, res) => {
  image.handleImage(req, res, db);
});
// API call to clarifai
app.post('/imageurl', (req, res) => {
  image.handleAPICall(req, res);
});

// Get leaderboard
app.get('/leaderboard', (req, res) => {
  leaderboard.handleLeaderboardGet(req, res, db);
});

app.listen(process.env.PORT || 6969, () => {
  console.log(`🚀🚀🚀 App is runnin on port ${process.env.PORT} 🔥🔥🔥`);
});
