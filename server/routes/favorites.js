const express = require('express');
const router = express.Router();
const FavoriteAnime = require('../models/FavoriteAnime');
const FavoriteTeam = require('../models/FavoriteTeam');
const auth = require('../middleware/auth'); // ✅ import middleware

// ✅ Save Favorite Anime (Protected)
router.post('/anime', auth, async (req, res) => {
  const { animeId, title, posterImage, rating } = req.body;
  const userId = req.userId; // ✅ from token

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

// ✅ Get Favorite Anime by User (Protected)
router.get('/anime', auth, async (req, res) => {
  try {
    const data = await FavoriteAnime.find({ userId: req.userId });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Remove Favorite Anime (Protected)
router.delete('/anime/:animeId', auth, async (req, res) => {
  try {
    await FavoriteAnime.findOneAndDelete({
      userId: req.userId,
      animeId: req.params.animeId
    });
    res.status(200).json({ message: "Anime removed from favorites" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Save Favorite Sports Team (Protected)
router.post('/sports', auth, async (req, res) => {
  const { teamId, teamName, teamBadge, league, country } = req.body;
  const userId = req.userId;

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

// ✅ Get Favorite Sports Teams (Protected)
router.get('/sports', auth, async (req, res) => {
  try {
    const data = await FavoriteTeam.find({ userId: req.userId });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Remove Favorite Team (Protected)
router.delete('/sports/:teamId', auth, async (req, res) => {
  try {
    await FavoriteTeam.findOneAndDelete({
      userId: req.userId,
      teamId: req.params.teamId
    });
    res.status(200).json({ message: "Team removed from favorites" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
