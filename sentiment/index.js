const express = require('express');
const natural = require('natural');

const app = express();
app.use(express.json());

app.post('/sentiment', (req, res) => {
  const { sentence } = req.query.sentence ? req.query : req.body;
  if (!sentence) return res.status(400).json({ error: 'No sentence provided' });

  const Analyzer = natural.SentimentAnalyzer;
  const stemmer = natural.PorterStemmer;
  const analyzer = new Analyzer('English', stemmer, 'afinn');
  const tokens = new natural.WordTokenizer().tokenize(sentence);
  const score = analyzer.getSentiment(tokens);

  let sentiment = 'neutral';
  if (score < 0) sentiment = 'negative';
  else if (score > 0.33) sentiment = 'positive';

  res.json({ sentimentScore: score, sentiment });
});

app.listen(3000, () => console.log('Sentiment service on port 3000'));
