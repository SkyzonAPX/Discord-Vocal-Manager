module.exports = {
    name: "ban",
    description: "Bannit un utilisateur de votre salon vocal temporaire.",
    permission: "Aucune",
    dm: false,
    category: "Vocaux",
    options: [
        {
            type: "user",
            name: "utilisateur",
            description: "Utilisateur à bannir",
            required: true
        }
    ],

    async run(bot, message, args) {
        const user = message.user;
        const target = args.getUser("utilisateur");
        const channel = message.member.voice?.channel;

        if (!channel) return message.reply("> Vous n'êtes pas dans un salon vocal.");
        const config = bot.vocalData?.[channel.id];

        if (!config || config.owner !== user.id)
            return message.reply("> Vous n'êtes pas le propriétaire de ce salon.");

        if (!config || config.owner == target.id)
            return message.reply({ content: `> Pk tu veux te ban ?`, ephemeral: true });

        if (!bot.vocalData[channel.id].banned) bot.vocalData[channel.id].banned = [];
        bot.vocalData[channel.id].banned.push(target.id);

        await channel.permissionOverwrites.edit(target.id, { Connect: false });

        const member = channel.members.get(target.id);
        if (member) await member.voice.setChannel(null);

        await message.reply(`⛔ <@${target.id}> a été banni du salon.`);
    }
};