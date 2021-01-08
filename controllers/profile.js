const handleProfileGet = (req, res, db) => {
  const {id } = req.params;

  db.select('*').where({id}).from('users')
    .then(user => {
      if (user.length) {
        res.json(user[0]);
      } else {
        res.status(400).json('Error getting user')
      }
    })
    .catch(err => res.status(400).json('Not found'));
}

module.exports = {
  handleProfileGet: handleProfileGet
};