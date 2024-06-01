const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const scrapeTrends = require('./scraper');
const Trend = require('./models/trend');
const app = express();

require("dotenv").config();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});



app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
    const latestTrend = await Trend.findOne().sort({ timestamp: -1 });
    res.render('index', { trend: latestTrend });
});

app.get('/scrape', async (req, res) => {
    const trendData = await scrapeTrends();
    res.json(trendData);
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
