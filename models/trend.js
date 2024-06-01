const mongoose = require('mongoose');

const trendSchema = new mongoose.Schema({
    unique_id: String,
    nameoftrend1: String,
    nameoftrend2: String,
    nameoftrend3: String,
    nameoftrend4: String,
    nameoftrend5: String,
    timestamp: Date,
    ip_address: String
});

module.exports = mongoose.model('Trend', trendSchema);
