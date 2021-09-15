const commands = require('../msgCommandList')

module.exports = {
    name: 'messageCreate',
    async execute(msg) {
        if (msg.author.bot || !msg.content.startsWith('c?')) return

        const [commandName, ...args] = msg.content.substring(2).split(' ')
        const command = commands.get(commandName)
        if (!command) return

        try {
            await command.execute(msg, ...args)
        } catch (err) {
            console.error(err)
            await msg.reply({
                content: 'There was an error while executing the command!',
                ephemeral: true,
            })
        }
        
    }
}