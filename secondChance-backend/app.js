/* jshint esversion: 8 */
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')
const pinoLogger = require('./logger')

const connectToDatabase = require('./models/db')

const app = express()

app.disable('etag')

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private')
  res.set('Pragma', 'no-cache')
  res.set('Expires', '0')
  next()
})

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: '*',
  credentials: true
}))

app.options('*', cors())

const port = process.env.PORT || 3060

connectToDatabase().then(() => {
  pinoLogger.info('Connected to DB')
})
  .catch((e) => console.error('Failed to connect to DB', e))

app.use(express.json())

app.use(express.static('public'))
app.use('/public', express.static(path.join(__dirname, 'public')))
app.use('/images', express.static(path.join(__dirname, 'public/images')))

const authRoutes = require('./routes/authRoutes')
const secondChanceItemsRoutes = require('./routes/secondChanceItemsRoutes')
const searchRoutes = require('./routes/searchRoutes')

const pinoHttp = require('pino-http')
const logger = require('./logger')

app.use(pinoHttp({ logger }))

app.use('/api/auth', authRoutes)
app.use('/api/secondchance/items', secondChanceItemsRoutes)
app.use('/api/gifts', secondChanceItemsRoutes)
app.use('/api/secondchance/search', searchRoutes)

app.use((err, req, res, next) => {
  console.error('Global Error Handler caught:', err)
  res.status(500).json({ error: 'Internal Server Error', message: err.message })
})

app.get('/', (req, res) => {
  res.send('Inside the server')
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
