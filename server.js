const dotenv = require('dotenv');
const express = require('express');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

dotenv.config();

const db = knex({
  client: 'pg',
  connection: {
    host: process.env.DATABASE_URL,
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

app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt)});

app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db)});

app.put('/image', (req, res) => {image.handleImage(req, res, db)} );
app.post('/imageurl', (req, res) => {image.handleAPICall(req, res)});

app.listen(process.env.PORT || 3000, () => {
  console.log(`🚀🚀🚀 App is runnin on port ${process.env.PORT} 🔥🔥🔥`);
});