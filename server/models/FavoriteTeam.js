const mongoose = require('mongoose');

const FavoriteTeamSchema = new mongoose.Schema({
  userId: String,
  teamId: String,
  teamName: String,
  teamBadge: String,
  league: String,
  country: String
});

module.exports = mongoose.model('FavoriteTeam', FavoriteTeamSchema);
