const { Permissions } = require('discord.js');

const getIDFromPing = input => {
    if (!input) return

    // if input is ping, it would have format <@idgoeshere>
    // or <@!idgoeshere>
    if (input.startsWith('<@') && input.endsWith('>')) {
		input = input.slice(2, -1);
		if (input.startsWith('!')) {
			input = input.slice(1);
		}
		return input
	}

    // else, just assume that its already id
    return input
}

module.exports = {
    name: 'president',
    description: `\`\`\`
    Command: c?president
    Description: Set specified user as president of club
    Format: c?president [user] [clubName]\`\`\`
    `,

    async execute(msg, ...args) {
        if (!msg.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            return
        }

        if (!args?.length) {
            msg.channel.send(this.description)
            return
        }

        const [userInput, ...rest] = args
        const clubName = rest.join('-')
        const userID = getIDFromPing(userInput)

        const user = await msg.guild.members.fetch(userID).catch(err => {
            msg.channel.send(`Cannot find user ${userInput}`)
        })
        if (!user) return

        if (!clubName) {
            msg.channel.send(`Please specify a club name`)
            return
        }

        const presRole = await msg.guild.roles.cache.find(r => r.name === `${clubName}-president`)
        if (!presRole) {
            msg.channel.send(`Found no club with name ${clubName}`)
            return
        }

        // remove current president
        presRole.members.forEach(member => {
            member.roles.remove(presRole.id)
        })

        user.roles.add(presRole)

        await msg.channel.send(`user ${user.displayName} is now president of ${rest.join(' ')}`)
    }
}