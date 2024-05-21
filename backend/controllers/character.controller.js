const { updateCharacterActiveStatus, deleteCharacter, addCharacter, editCharacter, getCharacterById, getCharacters } = require("../services/character.service");

exports.addCharacter = async (req, res, next) => {
  try {
    const characterData = req.body;
    const newCharacter = await addCharacter(characterData);
    res.status(201).json({ message: "Character added successfully", character: newCharacter });
  } catch (error) {
    next(error);
  }
};

exports.deleteCharacter = async (req, res, next) => {
  try {
    const { characterId } = req.params;
    const character = await deleteCharacter(characterId);
    if (!character) {
      return res.status(404).json({ message: "Character not found" });
    }
    res.json({ message: "Character deleted successfully" });
  } catch (error) {
    console.error('Error in deleteCharacter:', error);
    next(error);
  }
};


exports.editCharacter = async (req, res, next) => {
  try {
    const { characterId } = req.params;
    const updateData = req.body;
    const updatedCharacter = await updateCharacter(characterId, updateData);
    res.json({ message: "Character updated successfully", character: updatedCharacter });
  } catch (error) {
    next(error);
  }
};

exports.editActive = async (req, res, next) => {
  try {
    const { characterId } = req.params;
    const updatedCharacter = await updateCharacterActiveStatus(characterId);
    res.json({ message: "Character active status set to false", character: updatedCharacter });
  } catch (error) {
    next(error);
  }
};


exports.getCharacterDetails = async (req, res, next) => {
  try {
    const { characterId } = req.params;
    const character = await getCharacterById(characterId);

    // Check whether the active field is false
    if (character && !character.active) {
      // Empty data is returned to indicate that the character is not present or that the character is deactivated
      return res.status(200).json({});
    }
  } catch (error) {
    next(error);
  }
};

exports.getAllCharacters = async (req, res, next) => {
  try {
    const characters = await getCharacters({ active: true });
    res.json(characters);
  } catch (error) {
    next(error);
  }
};