const { Permissions } = require('discord.js');
const { formatClubName } = require('../helpers')

module.exports = {
    name: 'leave',
    description: `\`\`\`
    Command: c?leave
    Description: Leave a club.
    Format: c?leave [clubName]\`\`\`
    `,
    
    
    async execute(msg, ...args) {
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

        if (!msg.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR) && !clubName.endsWith('club')) {
            msg.channel.send(`You have no permissions to leave a channel that is not a club!`)
            return
        }

        // TODO: issue with channel that is not club
        clubChannel.permissionOverwrites.edit(msg.member.id, {
            VIEW_CHANNEL: false,
        })

        msg.channel.send(`You have left club ${clubName}`)
    }
}