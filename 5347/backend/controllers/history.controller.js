const { getCharacterHistory } = require("../services/history.service");

exports.getCharacterHistory = async (req, res, next) => {
  try {
    const { characterId } = req.params;
    const history = await getCharacterHistory(characterId);
    res.json({ history });
  } catch (error) {
    next(error);
  }
};