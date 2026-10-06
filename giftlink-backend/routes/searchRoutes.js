const express = require('express');
const connectToDatabase = require('../models/db');
const router = express.Router();

// /api/search?name=...&category=...&condition=...&age_years=...
router.get('/', async (req, res, next) => {
  try {
    const db = await connectToDatabase();
    const query = {};

    if (req.query.name && req.query.name.trim() !== '') {
      query.name = { $regex: req.query.name, $options: 'i' };
    }
    if (req.query.category) query.category = req.query.category;      // filter by category
    if (req.query.condition) query.condition = req.query.condition;
    if (req.query.age_years) query.age_years = { $lte: parseInt(req.query.age_years, 10) };

    const gifts = await db.collection('gifts').find(query).toArray();
    res.json(gifts);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
