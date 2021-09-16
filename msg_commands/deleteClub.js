const { Permissions } = require('discord.js');

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

            const channel = msg.guild.channels.cache.find(r => r.name === clubName)
            if (!channel) {
                msg.channel.send(`Found no club with name ${clubName}`)
                return
            }

            const presRole = msg.guild.roles.cache.find(r => r.name === `${clubName}-president`)
            const promiseChannelDel = channel?.delete()
            const promiseRoleDel = presRole?.delete()

            if (!promiseChannelDel || !promiseRoleDel) {
                /* If one of the operations didn't work, the club|role might not have been deleted... should we test if they exist, or assume that it failed cause they are already deleted? Also should we store it somewhere, as logs, to see how frequent it is? */
            }
            msg.channel.send(`Deleted club ${clubName}`)
        } catch (err) {
            console.error(err)
            msg.channel.send('An error has occurred when trying to delete the club')
        }
    }
}