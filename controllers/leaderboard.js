const handleLeaderboardGet = async (req, res, db) => {
  await db
    .select('*')
    .from('users')
    .orderBy('entries', 'desc')
    .limit(10)
    .then((data) => {
      if (data.length) {
        return res.json({ users: data });
      }
      return res.status(400).json('Error getting leaderboard');
    })
    .catch((err) => res.status(400).json('Leaderboard not found'));
};

module.exports = {
  handleLeaderboardGet,
};
