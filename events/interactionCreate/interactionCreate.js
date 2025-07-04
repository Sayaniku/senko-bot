const { devs, testServer } = require('../../config.json');
const getLocalCommands = require('../../utils/getLocalCommands');

module.exports = async (client, interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const localCommands = getLocalCommands();

    const commandObject = localCommands.find(
        (cmd) => cmd.name === interaction.commandName
    );

    if (!commandObject) return;

    try {
        // Vérifie si commande est réservée aux devs
        if (commandObject.devOnly && !devs.includes(interaction.user.id)) {
            return interaction.reply({
                content: 'Uniquement le dev peut faire cette commande.',
                ephemeral: true,
            });
        }

        // Vérifie si commande est réservée au serveur de test
        if (commandObject.testOnly && interaction.guild.id !== testServer) {
            return interaction.reply({
                content: 'Cette commande ne peut pas être exécutée ici.',
                ephemeral: true,
            });
        }

        // Vérifie les permissions utilisateur
        if (commandObject.permissionsRequired?.length) {
            for (const permission of commandObject.permissionsRequired) {
                if (!interaction.member.permissions.has(permission)) {
                    return interaction.reply({
                        content: 'Tu n’as pas les permissions nécessaires.',
                        ephemeral: true,
                    });
                }
            }
        }

        // Vérifie les permissions du bot
        if (commandObject.botPermissions?.length) {
            const bot = interaction.guild.members.me;
            for (const permission of commandObject.botPermissions) {
                if (!bot.permissions.has(permission)) {
                    return interaction.reply({
                        content: "Je n’ai pas les permissions nécessaires.",
                        ephemeral: true,
                    });
                }
            }
        }

        // Exécution de la commande
        await commandObject.callback(client, interaction);
    } catch (error) {
        console.log(`Erreur lors de l'exécution de la commande :`, error);
        interaction.reply({
            content: 'Une erreur est survenue lors de l’exécution de cette commande.',
            ephemeral: true,
        });
    }
};
