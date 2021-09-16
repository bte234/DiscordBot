const { Permissions } = require('discord.js');

module.exports = {
    name: 'create',
    description: `\`\`\`
    Command: c?create
    Description: Create a club with specified name.
    Format: c?create [clubName]\`\`\`
    `,
    
    async execute(msg, ...args) {
        if (!msg.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            return
        }

        // To avoid the input 'club--name' for example (Discord creates it as 'club-name')
        // This way you can't create the same club, as 'club-name' and 'club--name'
        const clubName = args.join('-').split('-')?.filter(e => e !== '').join('-')

        if (!clubName) {
            msg.channel.send(this.description)
            return
        }

        // Check if the channel exists
        const channels = msg.guild.channels.cache

        const textChannels = channels.filter(channel => channel.type === "GUILD_TEXT")
            .map(channel => channel.name)

        if (textChannels.indexOf(clubName) !== -1) {
          msg.channel.send('There\'s already a club with that name')

          return
        }

        const presRole = await msg.guild.roles.create({
            name: `${clubName}-president`,
        }).catch(err => {
          msg.channel.send('Club with specified name is already created')
          console.log(err)
          return
        })
        
        const channel = await msg.guild.channels.create(clubName, {
            type: 'GUILD_TEXT',
            permissionOverwrites: [
                {
                    id: msg.guild.id,
                    deny: [Permissions.FLAGS.VIEW_CHANNEL]
                },
                {
                    id: presRole.id,
                    allow: [Permissions.FLAGS.VIEW_CHANNEL]
                }
            ]
        }).catch(err => {
            msg.channel.send('Failed to create club')
            console.log(err)
            return
        })

        await msg.channel.send(`Club created`)
    }
}