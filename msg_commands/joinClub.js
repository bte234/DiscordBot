const { Permissions } = require('discord.js');
const { formatClubName } = require('../helpers')

module.exports = {
    name: 'join',
    description: `\`\`\`
    Command: c?join
    Description: Join a club.
    Format: c?join [clubName]\`\`\`
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
            msg.channel.send(`You have no permissions to join a channel that is not a club!`)
            return
        }

        // TODO: check user not banned
        // TODO: issue with channel that is not club
        clubChannel.permissionOverwrites.edit(msg.member.id, {
            VIEW_CHANNEL: true,
        })

        msg.channel.send(`You have joined club ${clubName}`)
    }
}