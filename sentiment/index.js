require('dotenv').config()
const express = require('express')
const NaturalManager = require('natural')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

const analyzer = new NaturalManager.SentimentAnalyzer(
  'English',
  NaturalManager.PorterStemmer,
  'afinn'
)

app.post('/sentiment', (req, res) => {
  const { sentence } = req.body

  if (!sentence) {
    return res.status(400).json({ error: 'Sentence is required' })
  }

  const tokenizer = new NaturalManager.WordTokenizer()
  const tokens = tokenizer.tokenize(sentence)
  const sentimentScore = analyzer.getSentiment(tokens)

  let sentiment = 'neutral'
  if (sentimentScore > 0) {
    sentiment = 'positive'
  } else if (sentimentScore < 0) {
    sentiment = 'negative'
  }

  return res.json({ sentiment, score: sentimentScore })
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
