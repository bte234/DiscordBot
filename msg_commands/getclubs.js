module.exports = {
    name: 'clubs',
    description: `\`\`\`
    Command: c?clubs
    Description: Returns a list of the existing clubs
    Format: c?clubs [search (optional)] [page]\`\`\``,

    async execute(msg, ...args) {
        if (!args ?.length) {
            msg.channel.send(this.description)
            return
        }

        const allowed = 5 // Default items it shows (set as 5 so we can see pagination without needing to add too many clubs)
        const [inputPage, ...inputSearch] = [/^\d+$/.test(args[args.length - 1]) ? parseInt(args?.pop()) : 1, ...args]

        const search = inputSearch ?.length > 0 ? inputSearch.join('-') : ''

        const clubChannels = msg.guild.channels.cache
            .sort()
            .filter(c => c.type === 'GUILD_TEXT' && c.name.endsWith('club') && c.name.indexOf(search) !== -1)
            .map(c => {
                const president = msg.guild.roles.cache.find(r => r.name === `${c.name}-president`) ?.members
                    .map(m => `${m.user.tag}`)

                return {
                    name: c.name, president: president ?.length ? president : undefined
                }
            })

        const totalPages = Math.ceil(clubChannels.length / allowed)
        const page = inputPage < 1 ? 1 : (inputPage > totalPages ? totalPages : inputPage)
        const [start, end] = [(page - 1) * allowed, page * allowed]

        const returnedChannels = clubChannels.slice(start, end)

        msg.channel.send(
            `\`\`\`Page ${page} of ${totalPages}\nList of available clubs for the search '${search}':\n\n${returnedChannels.map(c => `Club: ${c.name}. President: ${c.president || 'unset'}`).join('\n')}\`\`\``
        )
    }
}