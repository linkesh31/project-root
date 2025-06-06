const express = require('express');
const router = express.Router();
const FavoriteAnime = require('../models/FavoriteAnime');
const FavoriteGame = require('../models/FavoriteGame');
const auth = require('../middleware/auth');

// ✅ Anime routes
router.post('/anime', auth, async (req, res) => {
  const { animeId, title, posterImage, rating } = req.body;
  const userId = req.userId;

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

router.get('/anime', auth, async (req, res) => {
  try {
    const data = await FavoriteAnime.find({ userId: req.userId });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/anime/:animeId', auth, async (req, res) => {
  try {
    await FavoriteAnime.findOneAndDelete({
      userId: req.userId,
      animeId: req.params.animeId
    });
    res.status(200).json({ message: "Anime removed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Game routes
router.post('/games', auth, async (req, res) => {
  const { gameId, title, posterImage, rating } = req.body;
  const userId = req.userId;

  try {
    const exists = await FavoriteGame.findOne({ userId, gameId });
    if (exists) return res.status(400).json({ message: "Already saved" });

    const fav = new FavoriteGame({ userId, gameId, title, posterImage, rating });
    await fav.save();
    res.status(200).json({ message: "Game saved" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/games', auth, async (req, res) => {
  try {
    const data = await FavoriteGame.find({ userId: req.userId });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/games/:gameId', auth, async (req, res) => {
  try {
    await FavoriteGame.findOneAndDelete({
      userId: req.userId,
      gameId: req.params.gameId
    });
    res.status(200).json({ message: "Game removed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
