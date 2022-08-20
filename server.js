require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const ShortUrl = require('./models/shortUrlSchema')

mongoose.connect(process.env.MONGO_URI)

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

app.get('/', async (req, res) => {
  const shortUrls = await ShortUrl.find()
  res.render('index', { shortUrls })
})

app.post('/shorturls', async (req, res) => {
  await ShortUrl.create({ full: req.body.fullUrl })
  res.redirect('/')
})

app.get('/:shortUrl', async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
  if(shortUrl == null) res.redirect('/')
  shortUrl.clicks += 1
  await shortUrl.save()
  res.redirect(shortUrl.full)
})

app.listen(process.env.PORT || 5000)