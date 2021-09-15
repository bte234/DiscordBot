module.exports = {
    name: 'president',
    
    async execute(msg, ...args) {
        msg.reply(`c?president: ${args}`)
    }
}