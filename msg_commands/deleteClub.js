const { Permissions } = require('discord.js');
const { formatClubName } = require('../helpers')

module.exports = {
    name: 'delete',
    description: `\`\`\`
    Command: c?delete
    Description: Delete a club
    Format: c?delete [clubName]\`\`\`
    `,
    
    async execute(msg, ...args) {
        try {
            if (!msg.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
                return
            }

            const clubName = formatClubName(args)

            if (!clubName) {
                msg.channel.send(this.description)
                return
            }

            const clubChannel = msg.guild.channels.cache.find(channel => channel.name === clubName)

            if (!clubChannel) {
                msg.channel.send(`Cannot find any club with name ${clubName}`)
                return
            }

            const channel = msg.guild.channels.cache.find(r => r.name === clubName)

            const presRole = msg.guild.roles.cache.find(r => r.name === `${clubName}-president`)
            const promises = [channel?.delete(), presRole?.delete()]

            if (promises.includes(undefined, null)) {
                msg.channel.send(`An error has occurred when trying to delete the club`)
                return
            }

            await Promise.all(promises);
            msg.channel.send(`Deleted club ${clubName}`)
        } catch (err) {
            console.error(err)
            msg.channel.send('An error has occurred when trying to delete the club')
        }
    }
}