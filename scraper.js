const puppeteer = require('puppeteer');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const Trend = require('./models/trend');
const PROXY = "https://proxymesh.com";  // Replace with your ProxyMesh URL
require("dotenv").config();
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});



async function scrapeTrends() {
    const browser = await puppeteer.launch({
        args: [`--proxy-server=${PROXY}`],
        headless: true
    });
    const page = await browser.newPage();

    await page.goto('https://twitter.com/login', { waitUntil: 'networkidle2' });
    await page.type('input[name="session[username_or_email]"]', 'twitter_username');
    console.log("hi")
    await page.click('div[role="button"]:has(span:contains("Next"))');
    await page.waitForSelector('input[name="session[password]"]', { visible: true });

    // Enter password and click login
    await page.type('input[name="session[password]"]', 'twitter_password');
    await page.click('div[data-testid="LoginForm_Login_Button"]');

    // Wait for navigation
    await page.waitForNavigation();

    await page.goto('https://twitter.com/explore/tabs/trending', { waitUntil: 'networkidle2' });

    const trendNames = await page.evaluate(() => {
        const trends = document.querySelectorAll('div[aria-label="Timeline: Trending now"] span.css-901oao');
        return Array.from(trends).slice(0, 5).map(trend => trend.innerText);
    });

    const ipAddress = await page.evaluate(() => {
        return fetch('https://api.ipify.org?format=json')
            .then(response => response.json())
            .then(data => data.ip);
    });

    await browser.close();

    const trendData = {
        unique_id: uuidv4(),
        nameoftrend1: trendNames[0] || '',
        nameoftrend2: trendNames[1] || '',
        nameoftrend3: trendNames[2] || '',
        nameoftrend4: trendNames[3] || '',
        nameoftrend5: trendNames[4] || '',
        timestamp: new Date(),
        ip_address: ipAddress
    };

    const trend = new Trend(trendData);
    await trend.save();

    return trendData;
}

module.exports = scrapeTrends;
