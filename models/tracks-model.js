const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const TracksSchema = Schema({
    artistNames: [String],
});

const Tracks = mongoose.model('Tracks', TracksSchema);

module.exports = Tracks;
