const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const connectToDatabase = require('../models/db');
require('dotenv').config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Register
router.post('/register', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const users = db.collection('users');
    if (await users.findOne({ email: req.body.email })) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    const salt = await bcryptjs.genSalt(10);
    const hash = await bcryptjs.hash(req.body.password, salt);
    const result = await users.insertOne({
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: hash,
      createdAt: new Date(),
    });
    const authtoken = jwt.sign({ user: { id: result.insertedId.toString() } }, JWT_SECRET);
    res.json({ authtoken, email: req.body.email });
  } catch (e) {
    res.status(500).send('Internal server error');
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const user = await db.collection('users').findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const ok = await bcryptjs.compare(req.body.password, user.password);
    if (!ok) return res.status(401).json({ error: 'Wrong password' });

    const authtoken = jwt.sign({ user: { id: user._id.toString() } }, JWT_SECRET);
    res.json({ authtoken, userName: user.firstName, userEmail: user.email });
  } catch (e) {
    res.status(500).send('Internal server error');
  }
});

// Update user
router.put(
  '/update',
  [body('name', 'Name is required').notEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const email = req.headers.email;
      if (!email) return res.status(400).json({ error: 'Email not found in the request headers' });

      const db = await connectToDatabase();
      const users = db.collection('users');
      const existing = await users.findOne({ email });
      if (!existing) return res.status(404).json({ error: 'User not found' });

      existing.firstName = req.body.name;
      existing.updatedAt = new Date();
      const updated = await users.findOneAndUpdate(
        { email },
        { $set: existing },
        { returnDocument: 'after' }
      );
      const authtoken = jwt.sign({ user: { id: updated._id.toString() } }, JWT_SECRET);
      res.json({ authtoken });
    } catch (e) {
      res.status(500).send('Internal server error');
    }
  }
);

module.exports = router;
