const express = require('express');
const bcrypt = require('bcryptjs');
const cors = require('cors');


const app = express();

const database = {
  users: [
    {
      id: '123',
      name: 'John',
      email: 'john@example.com',
      password: 'cookies',
      entries: 0,
      joined: new Date(),
    },
    {
      id: '124',
      name: 'Sally',
      email: 'sally@example.com',
      password: 'bananas',
      entries: 0,
      joined: new Date(),
    }
  ],
  login: [
    {
      id: '987',
      hash: '',
      email: `john@example.com`,
    }
  ]
}

// Middleware
app.use(express.json());
app.use(cors());

// Routes 
app.get('/', (req, res) => {
  res.send(database.users);
});

app.post('/signin', (req, res) => {
  if (req.body.email === database.users[0].email && req.body.password === database.users[0].password) {
    res.json(database.users[0]);
  } else {
    res.status(400).json('error logging in');
  }
});

app.post('/register', (req, res) => {
  const {email, name, password} = req.body;

   database.users.push({
    id: '125',
    name,
    email,
    entries: 0,
    joined: new Date(),
  });
  res.json(database.users[database.users.length - 1]);
});

app.get('/profile/:id', (req, res) => {
  const {id } = req.params;
  let found = false;
  database.users.forEach(user => {
    if(user.id === id) {
      found = true;
      return res.json(user);
    }
  });
  if (!found) {
    res.status(404).json('no such user');
  }
})

app.put('/image', (req, res) => {
  const {id } = req.body;
  let found = false;
  database.users.forEach(user => {
    if(user.id === id) {
      found = true;
      user.entries++;
      return res.json(user.entries);
    }
  });

  if (!found) {
    res.status(404).json('not found');
  }

});

// // Hash a password
// bcrypt.hash('bacon', 8, function(err, hash) {
//   // store hash in database
// });

// // Load hash from your password DB.
// bcrypt.compare("B4c0/\/", hash, function(err, res) {
//   // res === true
// });
// bcrypt.compare("not_bacon", hash, function(err, res) {
//   // res === false
// });

// // As of bcryptjs 2.4.0, compare returns a promise if callback is omitted:
// bcrypt.compare("B4c0/\/", hash).then((res) => {
//   // res === true
// });

app.listen(6969, () => {
  console.log(`🚀🚀🚀 App is runnin on port 6969 🔥🔥🔥`);
});