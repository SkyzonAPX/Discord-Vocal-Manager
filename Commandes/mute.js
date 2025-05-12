module.exports = {
    name: "mute",
    description: "Mute un utilisateur dans votre salon vocal temporaire.",
    permission: "Aucune",
    dm: false,
    category: "Vocaux",
    options: [
        {
            type: "user",
            name: "utilisateur",
            description: "Utilisateur à mute",
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
            return message.reply({ content: `> T'en a marre de t'entendre ? (Je comprend... moi aussi tu me fait chier)`, ephemeral: true });

        await channel.permissionOverwrites.edit(target.id, { Speak: false });
        await message.reply(`🔇 <@${target.id}> a été mute dans le salon.`);
    }
};