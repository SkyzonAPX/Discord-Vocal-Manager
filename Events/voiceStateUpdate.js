const Discord = require("discord.js");

module.exports = async (bot, oldState, newState) => {
    const guild = newState.guild;

    if (!bot.vocalConfig) bot.vocalConfig = {};
    if (!bot.vocalData) bot.vocalData = {};

    const config = bot.vocalConfig[guild.id];
    if (!config) return;

    const creatorChannelId = config.creatorChannel;

    // Création du salon temporaire
    if (newState.channelId === creatorChannelId) {
        const user = newState.member;

        const channel = await guild.channels.create({
            name: `🎧 ${user.user.username}`,
            type: Discord.ChannelType.GuildVoice,
            parent: newState.channel.parent,
            permissionOverwrites: [
                {
                    id: guild.id,
                    deny: [Discord.PermissionFlagsBits.Connect],
                },
                {
                    id: user.id,
                    allow: [
                        Discord.PermissionFlagsBits.Connect,
                        Discord.PermissionFlagsBits.Speak,
                        Discord.PermissionFlagsBits.MuteMembers,
                        Discord.PermissionFlagsBits.ManageChannels
                    ],
                },
            ],
        });

        bot.vocalData[channel.id] = {
            owner: user.id,
            banned: [],
        };

        await user.voice.setChannel(channel);
        console.log(`Salon ${channel.name} ajouter.`)
    }

    // Suppression du salon s'il est vide
    if (
        oldState.channelId &&
        bot.vocalData[oldState.channelId] &&
        oldState.channel.members.size === 0
    ) {
        delete bot.vocalData[oldState.channelId];
        await oldState.channel.delete().catch(() => {});
    }

    // Transfert automatique de propriété
    if (
        oldState.channelId &&
        bot.vocalData[oldState.channelId] &&
        bot.vocalData[oldState.channelId].owner === oldState.member.id
    ) {
        const channel = oldState.channel;
        const remainingMembers = [...channel.members.values()].filter(m => !m.user.bot);

        if (remainingMembers.length > 0) {
            const newOwner = remainingMembers[0];
            bot.vocalData[channel.id].owner = newOwner.id;

            await channel.permissionOverwrites.edit(newOwner.id, {
                Connect: true,
                Speak: true,
                MuteMembers: true,
                ManageChannels: true,
            });

            const textChannel = guild.channels.cache.find(c =>
                c.type === Discord.ChannelType.GuildText && c.name === "général"
            );

            if (textChannel) {
                textChannel.send(`🔄 Le salon vocal **${channel.name}** appartient désormais à ${newOwner}.`);
            }
        } else {
            delete bot.vocalData[oldState.channelId];
            await oldState.channel.delete().catch(() => {});
        }
    }
};
