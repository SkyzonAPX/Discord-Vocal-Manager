module.exports = {
    name: "rename",
    description: "Renomme votre salon vocal temporaire (si vous en êtes le propriétaire)",
    permission: "Aucune",
    dm: false,
    category: "Vocaux",
    options: [
        {
            type: "string",
            name: "nom",
            description: "Nouveau nom du salon",
            required: true
        }
    ],

    async run(bot, message, args) {
        const user = message.user;
        const newName = args.getString("nom");
        const channel = message.member.voice?.channel;

        if (!channel) return message.reply("> Vous n'êtes pas dans un salon vocal.");

        const config = bot.vocalData?.[channel.id];
        if (!config || config.owner !== user.id)
            return message.reply("> Vous n'êtes pas le propriétaire de ce salon.");

        await channel.setName(newName);
        await message.reply(`✅ Salon renommé en \`${newName}\``);
    }
};