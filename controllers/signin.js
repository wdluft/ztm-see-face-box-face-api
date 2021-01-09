const handleSignIn = (db, bcrypt, validationResult) => (req, res) => {
  const { email, password } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  db.select('email', 'hash')
    .from('login')
    .where('email', '=', email)
    .then((data) => {
      const isValid = bcrypt.compareSync(password, data[0].hash);

      if (isValid) {
        return db
          .select('*')
          .from('users')
          .where('email', '=', email)
          .then((user) => {
            res.json(user[0]);
          })
          .catch((err) =>
            res.status(400).json({
              errors: [{ msg: `Unable to get user. Please try again` }],
            })
          );
      }
      res
        .status(400)
        .json({ errors: [{ msg: `Email and password do not match` }] });
    })
    .catch((err) =>
      res
        .status(400)
        .json({ errors: [{ msg: `Email and password do not match` }] })
    );
};

module.exports = {
  handleSignIn,
};
