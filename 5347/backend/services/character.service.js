const createHttpError = require("http-errors");
const CharacterModel = require("../models/characters.js");

exports.createCharacter = async (characterData) => {
    const { name, subtitle, description, image_url, strength, speed, skill, fear_factor, power, intelligence, wealth } = characterData;

    if (!name) {
        throw createHttpError.BadRequest("Please provide character name.");
    }

    const character = await new CharacterModel({
        name,
        subtitle,
        description,
        image_url,
        strength,
        speed,
        skill,
        fear_factor,
        power,
        intelligence,
        wealth,
    }).save();

    return character;
};

exports.updateCharacterActiveStatus = async (id) => {
    const character = await CharacterModel.findOne({ id: id }); 
    
    if (!character) {
        throw createHttpError.NotFound("Character not found.");
    }
    
    character.active = false; 
    await character.save(); 
    
    return character;
};

exports.getCharacters = async (filter = {}) => {
    const characters = await CharacterModel.find(filter);
    return characters;
  };

exports.getCharacterById = async (characterId) => {
    const character = await CharacterModel.findById(characterId);

    if (!character) {
        throw createHttpError.NotFound("Character not found.");
    }

    return character;
};

exports.updateCharacter = async (characterId, updateData) => {
    const character = await CharacterModel.findOneAndUpdate(
        { id: characterId },
        { $set: updateData },
        { new: true }
    );

    if (!character) {
        throw createHttpError.NotFound("Character not found.");
    }

    return character;
};

exports.deleteCharacter = async (characterId) => {
    const character = await CharacterModel.findByIdAndDelete(characterId);

    if (!character) {
        throw createHttpError.NotFound("Character not found.");
    }

    return character;
};