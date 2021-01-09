const handleRegister = (req, res, db, bcrypt, validationResult) => {
  const {email, name, password} = req.body;
  
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()});
  } else {

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
  
    db.transaction(trx => {
      trx.insert({
        hash,
        email,
      })
      .into('login')
      .returning('email')
      .then(loginEmail => {
  
        return trx('users').returning('*').insert({
          email: loginEmail[0],
          name,
          joined: new Date(),
        })
        .then(user => {
          res.json(user[0]);
        })
      })
      .then(trx.commit)
      .catch(trx.rollback);
    })
    .catch(err => res.status(400).json('unable to register'));
  }

 }

 module.exports = {
   handleRegister: handleRegister
 };