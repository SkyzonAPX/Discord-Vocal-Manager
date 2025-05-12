const Discord = require("discord.js");

module.exports = {
    name: "setvoc",
    description: "Définit le salon vocal utilisé pour la création automatique.",
    permission: Discord.PermissionFlagsBits.Administrator,
    dm: false,
    category: "Vocaux",
    options: [
        {
            type: "channel",
            channel_types: [2],
            name: "salon",
            description: "Salon vocal à surveiller",
            required: true
        }
    ],

    async run(bot, message, args) {
        const salon = args.getChannel("salon");

        if (!salon || salon.type !== Discord.ChannelType.GuildVoice) {
            return message.reply("> Ce n'est pas un salon vocal valide.");
        }

        if (!bot.vocalConfig) bot.vocalConfig = {};
        bot.vocalConfig[message.guild.id] = {
            creatorChannel: salon.id,
        };

        const embed = new Discord.EmbedBuilder()
            .setColor(bot.color)
            .setTitle("Salon de création vocale défini ✅")
            .setDescription(`Les utilisateurs qui rejoignent <#${salon.id}> auront un salon temporaire créé à leur nom.`)
            .setFooter({ text: message.user.username, iconURL: message.user.displayAvatarURL({ dynamic: true }) });

        await message.reply({ embeds: [embed] });
    }
};
