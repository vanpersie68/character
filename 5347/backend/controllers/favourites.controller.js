const { getFavouritesByUserId, addCharacterToFavourites, removeCharacterFromFavourites } = require("../services/favourites.service");

exports.getFavouritesByUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const favourites = await getFavouritesByUserId(userId);
    res.json({ favourites });
  } catch (error) {
    next(error);
  }
};

exports.addCharacterToFavourites = async (req, res, next) => {
  try {
    const { userId, characterId } = req.params;
    const updatedFavourites = await addCharacterToFavourites(userId, characterId);
    res.json({ message: "Character added to favourites successfully", favourites: updatedFavourites });
  } catch (error) {
    next(error);
  }
};

exports.removeCharacterFromFavourites = async (req, res, next) => {
  try {
    const { userId, characterId } = req.params;
    const updatedFavourites = await removeCharacterFromFavourites(userId, characterId);
    res.json({ message: "Character removed from favourites successfully", favourites: updatedFavourites });
  } catch (error) {
    next(error);
  }
};