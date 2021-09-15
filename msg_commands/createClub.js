const { Permissions } = require('discord.js');

module.exports = {
    name: 'create',
    description: `\`\`\`
    Command: c?create
    Description: Create a club with specified name.
    Format: c?create [clubName]\`\`\`
    `,
    
    async execute(msg, ...args) {
        const clubName = args.join('-')
        if (!clubName) {
            msg.channel.send(this.description)
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