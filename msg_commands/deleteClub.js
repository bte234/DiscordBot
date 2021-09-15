const { Permissions } = require('discord.js');

module.exports = {
    name: 'delete',
    description: `\`\`\`
    Command: c?delete
    Description: Delete a club
    Format: c?delete [clubName]\`\`\`
    `,
    
    async execute(msg, ...args) {
        if (!msg.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            return
        }

        const clubName = args.join('-')
        if (!clubName) {
            msg.channel.send(this.description)
            return
        }

        const channel = msg.guild.channels.cache.find(r => r.name === clubName)
        if (!channel) {
            msg.channel.send(`Found no club with name ${clubName}`)
            return
        }

        const presRole = msg.guild.roles.cache.find(r => r.name === `${clubName}-president`)
        channel.delete()
        presRole.delete()

        msg.channel.send(`Deleted club ${clubName}`)
    }
}