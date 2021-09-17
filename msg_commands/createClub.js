const { Permissions } = require('discord.js');
const { formatClubName } = require('../helpers')

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

        const clubName = formatClubName(args)

        if (!clubName) {
            msg.channel.send(this.description)
            return
        }

        // Check if the channel exists
        const channels = msg.guild.channels.cache

        const textChannels = channels.filter(channel => channel.type === "GUILD_TEXT" && channel.deleted === false)
            .map(channel => channel.name)

        if (textChannels.indexOf(clubName) !== -1) {
          msg.channel.send('There\'s already a club with that name')

          return
        }

        // If the category 'clubs' does not exist, we create it
        const textCategories = channels.filter(channel => channel.type === "GUILD_CATEGORY" && channel.deleted === false)
            .map(channel => channel.name)

        if (textCategories.map(item => item.toLowerCase()).indexOf('clubs') === -1) {
            await msg.guild.channels.create('clubs', {
                type: 'GUILD_CATEGORY',
                permissionOverwrites: [
                    {id: msg.guild.id, deny: ['VIEW_CHANNEL']},
                    {id: msg.author.id, allow: ['VIEW_CHANNEL']},
                ]
            })
        }

        const clubCategoryId = channels.filter(channel => channel.type === "GUILD_CATEGORY" && channel.name.toLowerCase() === 'clubs').map(channel => channel.id)[0]
                
        const presRole = await msg.guild.roles.create({
            name: `${clubName}-president`,
        }).catch(err => {
          msg.channel.send('Club with specified name is already created')
          console.log(err)
          return
        })
        
        const channel = await msg.guild.channels.create(clubName, {
            type: 'GUILD_TEXT',
            parent: clubCategoryId || null,
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