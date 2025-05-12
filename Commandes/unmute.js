module.exports = {
    name: "unmute",
    description: "Unmute un utilisateur dans votre salon vocal temporaire.",
    permission: "Aucune",
    dm: false,
    category: "Vocaux",
    options: [
        {
            type: "user",
            name: "utilisateur",
            description: "Utilisateur à unmute",
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

        await channel.permissionOverwrites.edit(target.id, { Speak: true });
        await message.reply(`🔊 <@${target.id}> a été unmute dans le salon.`);
    }
};