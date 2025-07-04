const messageCreate = require('./messageCreate');
const messageUpdate = require('./messageUpdate');
const messageDelete = require('./messageDelete');
//const nicknameChange = require('./nicknameChange'); // Importer la gestion des changements de pseudo

module.exports.execute = async (client, oldMessage, message, newMessage) => {
    // Appelle les fonctions appropriées selon le type d'événement
    if (message && !oldMessage) {
        // Message créé
        messageCreate(client, message);
    } else if (oldMessage && newMessage) {
        // Message modifié
        messageUpdate(client, oldMessage, newMessage);
    } else if (oldMessage && !newMessage) {
        // Message supprimé
        messageDelete(client, oldMessage);
    }
   // if (oldMember && newMember) {
        // Changement de pseudo
 //       nicknameChange(client, oldMember, newMember);
    //}
};
