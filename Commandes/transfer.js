module.exports = {
    name: "transfer",
    description: "Transfère la propriété de votre salon vocal temporaire.",
    permission: "Aucune",
    dm: false,
    category: "Vocaux",
    options: [
        {
            type: "user",
            name: "utilisateur",
            description: "Nouvel utilisateur propriétaire",
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

        if (!channel.members.has(target.id))
            return message.reply("> L'utilisateur doit être dans le salon.");

        bot.vocalData[channel.id].owner = target.id;
        await message.reply(`✅ Propriété transférée à <@${target.id}>.`);
    }
};