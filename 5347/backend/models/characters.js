const mongoose = require("mongoose");

const charactersSchema = mongoose.Schema({
    id : {
        type: String,
        required: true,
        unique: true
    },
    active: {
        type: Boolean,
        default: true,
    },
    name: {
        type: String,
        required: true,
    },
    subtitle: {
        type: String,
    },
    description: {
        type: String,
    },
    image_url: {
        type: String,
    },
    strength: {
        type: Number,
        default: 0,
    },
    speed: {
        type: Number,
        default: 0,
    },
    skill: {
        type: Number,
        default: 0,
    },
    fear_factor: {
        type: Number,
        default: 0,
    },
    power: {
        type: Number,
        default: 0,
    },
    intelligence: {
        type: Number,
        default: 0,
    },
    wealth: {
        type: Number,
        default: 0,
    },
}, {
    collection: "characters",
    timestamps: false,
    versionKey: false,
});

const CharactersModel = mongoose.model('characters', charactersSchema);
module.exports = CharactersModel;