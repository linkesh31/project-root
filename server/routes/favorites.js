const express = require('express');
const router = express.Router();
const FavoriteAnime = require('../models/FavoriteAnime');
const FavoriteTeam = require('../models/FavoriteTeam');

// ✅ Save Favorite Anime
router.post('/anime', async (req, res) => {
  const { userId, animeId, title, posterImage, rating } = req.body;
  try {
    const exists = await FavoriteAnime.findOne({ userId, animeId });
    if (exists) return res.status(400).json({ message: "Already saved" });

    const fav = new FavoriteAnime({ userId, animeId, title, posterImage, rating });
    await fav.save();
    res.status(200).json({ message: "Anime saved" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get Favorite Anime by User
router.get('/anime/:userId', async (req, res) => {
  try {
    const data = await FavoriteAnime.find({ userId: req.params.userId });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Save Favorite Sports Team
router.post('/sports', async (req, res) => {
  const { userId, teamId, teamName, teamBadge, league, country } = req.body;
  try {
    const exists = await FavoriteTeam.findOne({ userId, teamId });
    if (exists) return res.status(400).json({ message: "Already saved" });

    const fav = new FavoriteTeam({ userId, teamId, teamName, teamBadge, league, country });
    await fav.save();
    res.status(200).json({ message: "Team saved" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get Favorite Teams by User
router.get('/sports/:userId', async (req, res) => {
  try {
    const data = await FavoriteTeam.find({ userId: req.params.userId });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
