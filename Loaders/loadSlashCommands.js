const Discord = require("discord.js")
const { REST } = require("@discordjs/rest")
const { Routes } = require("discord.js")

module.exports = async bot => {

    let commands = [];

    bot.commands.forEach(async command => {

        let slashcommand = new Discord.SlashCommandBuilder()
        .setName(command.name)
        .setDescription(command.description)
        .setDMPermission(command.dm);

        // Vérification et gestion des permissions
        if (command.permission && command.permission !== "Aucune") {
            slashcommand.setDefaultMemberPermissions(command.permission);
        } else {
            slashcommand.setDefaultMemberPermissions(null);  // Si aucune permission n'est définie
        }
        
        // Ajout des options si elles existent
        if (command.options?.length >= 1) {
            for (let i = 0; i < command.options.length; i++) {
                slashcommand[`add${command.options[i].type.slice(0, 1).toUpperCase() + command.options[i].type.slice(1, command.options[i].type.length)}Option`](options => options.setName(command.options[i].name).setDescription(command.options[i].description).setRequired(command.options[i].required))
            }
        }

        await commands.push(slashcommand)
    })

    const rest = new REST({version: "10"}).setToken(bot.token)

    await rest.put(Routes.applicationCommands(bot.user.id), {body: commands})
    console.log("Les slashs commandes sont crées avec succès !")
}
