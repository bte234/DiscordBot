module.exports = {
    name: 'create',
    
    async execute(msg, ...args) {
        msg.reply(`c?create: ${args}`)
    }
}