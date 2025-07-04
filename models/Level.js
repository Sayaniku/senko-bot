const { Schema, model } = require('mongoose');

const levelSettingsSchema = new Schema({
    guildId: {
        type: String,
        required: true,
        unique: true,
    },
    enabled: {
        type: Boolean,
        default: true,
    },
    disabledChannels: {
        type: [String], // array d'ID de salons où c'est désactivé
        default: [],
    },
});

module.exports = model('LevelSettings', levelSettingsSchema);