// models/favourites.js
const mongoose = require('mongoose');

const favouritesSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'userlist',
  },
  characters: [String],
});

const FavouritesModel = mongoose.model('favourites', favouritesSchema);

module.exports = FavouritesModel;