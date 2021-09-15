module.exports = {
    name: 'mute',
    
    async execute(msg, ...args) {
        msg.reply(`c?mute: ${args}`)
    }
}