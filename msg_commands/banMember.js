module.exports = {
    name: 'ban',
    
    async execute(msg, ...args) {
        msg.reply(`c?ban: ${args}`)
    }
}