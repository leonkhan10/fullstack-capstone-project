require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectToDatabase = require('./models/db');

const giftRoutes = require('./routes/giftRoutes');
const authRoutes = require('./routes/authRoutes');
const searchRoutes = require('./routes/searchRoutes');

const app = express();
const port = process.env.PORT || 3060;

connectToDatabase()
  .then(() => console.log('Connected to DB'))
  .catch((e) => console.error('Failed to connect to DB', e));

app.use(cors());
app.use(express.json());
app.use('/images', express.static('public/images'));

app.use('/api/gifts', giftRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/search', searchRoutes);

app.get('/', (req, res) => res.send('Inside the server'));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Internal Server Error');
});

app.listen(port, () => console.log(`Server running on port ${port}`));
