const FavouritesModel = require('../models/favourites');
const mongoose = require("mongoose");

exports.getFavouritesByUserId = async (userId) => {
  try {
    const favourites = await FavouritesModel.findOne({ user_id: userId });
    return favourites;
  } catch (error) {
    throw new Error('Failed to get favourites');
  }
};

exports.addCharacterToFavourites = async (userId, characterId) => {
  try {
    const favourites = await FavouritesModel.findOneAndUpdate(
      { "user_id._id": new mongoose.Types.ObjectId(userId) },
      { $addToSet: { characters: characterId } },
      { upsert: true, new: true }
    );
    return favourites;
  } catch (error) {
    console.error('Error detail:', error); 
    throw new Error(`Failed to add character to favourites: ${error.message}`);
  }
};

exports.removeCharacterFromFavourites = async (userId, characterId) => {
  try {
    const favourites = await FavouritesModel.findOneAndUpdate(
      { "user_id._id": new mongoose.Types.ObjectId(userId) },
      { $pull: { characters: characterId } },
      { new: true }
    );
    return favourites;
  } catch (error) {
    throw new Error('Failed to remove character from favourites');
  }
};