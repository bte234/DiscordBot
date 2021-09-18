const { MessageEmbed, MessageActionRow, MessageButton, MessageCollector } = require('discord.js');

const [color, allowed, title] = ['#b1b12a', 5, 'c?clubs'] // Allowed -> Default items it shows (change to smaller value to test pagination)
let [search, page, totalPages] = ['', 1, 1]

module.exports = {
    name: 'clubs',
    description: `
    Command: c?clubs
    Description: Returns a list of the existing clubs
    Format: c?clubs [search (optional)] [page]`,

    async execute(msg, ...args) {

        if (!args ?.length) {
            // msg.channel.send(this.description)

            let fields = { name: 'help', value: this.description }
            setEmbed(msg, fields, null, null, 1)
            return
        }

        const [inputPage, ...inputSearch] = [/^\d+$/.test(args[args.length - 1]) ? parseInt(args ?.pop()) : 1, ...args]

        search = inputSearch ?.length > 0 ? inputSearch.join('-') : ''

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

        totalPages = Math.ceil(clubChannels.length / allowed)
        page = inputPage < 1 ? 1 : (inputPage > totalPages ? totalPages : inputPage)

        paginate(msg, clubChannels, page)
    }
}

const paginate = (msg, clubChannels, page, sent = null) => {
    const [start, end] = [(page - 1) * allowed, page * allowed]

    const returnedChannels = clubChannels.slice(start, end)

    let fields = [{ name: title, value: `List of available clubs${search ? ` for the search '${search}'` : ''}:\n\n${returnedChannels.map(c => `Club: ${c.name}. President: ${c.president || 'unset'}`).join('\n')}` }]

    setEmbed(msg, fields, clubChannels, page, sent)
}

const setEmbed = async (msg, fields, clubChannels, page, sent = null) => {
    const embed = new MessageEmbed()
        .setColor(color)
        // .setTitle(title)
        .setAuthor('Cornflower', 'https://cdn.discordapp.com/avatars/887481802476912711/5d8acf6398f0cf79344e54533695105c.webp?size=256', 'https://discord.js.org')
        .addFields(
            fields
        )
        .setFooter(`Page ${page} of ${totalPages}`)

    const components = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('TMK-left')
                .setLabel('⬅')
                .setStyle('SECONDARY')
                .setDisabled(!(page > 1))
        )
        .addComponents(
            new MessageButton()
                .setCustomId('TMK-right')
                .setLabel('➡')
                .setStyle('SECONDARY')
                .setDisabled(!(page < totalPages))
            // .setEmoji('833087684691361803')
        );

    // If it's null (first call), send message, otherwise we add an event to listen to the button actions
    if (sent) {
        sent.update({ embeds: [embed], components: [components], ephemeral: true })
    }
    else {
        components ? msg.channel.send({ embeds: [embed], components: [components], ephemeral: true }) : msg.channel.send({ embeds: [embed], ephemeral: true })
        msg.react('✅');

        const collector = msg.channel.createMessageComponentCollector({ componentType: 'BUTTON', time: 30000 });

        collector.on('collect', async i => {
            // /*
            if (i.user.id === msg.author.id) {
                if (i.customId === 'TMK-left') {
                    page--
                } else if (i.customId === 'TMK-right') {
                    page++
                }

                // i.update({ content: 'A button was clicked!', components: [components] }); // `${i.user.id} clicked on the ${i.customId} button.`
                paginate(msg, clubChannels, page, i)
            } else {
                i.reply({ content: `These buttons aren't for you!`, ephemeral: true });
            }
            // */
        });
    }
}