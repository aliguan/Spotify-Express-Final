const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const LocationSchema = Schema({
    coordinates: Object,
});

const Location = mongoose.model('Location', LocationSchema);

module.exports = Location;
