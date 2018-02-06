const mongoose = require('mongoose');

const MountainSchema = mongoose.Schema({
    name: String,
    height: Number
});

module.exports = mongoose.model('Mountain', MountainSchema);