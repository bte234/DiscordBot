module.exports = {
    name: 'delete',
    
    async execute(msg, ...args) {
        msg.reply(`c?delete: ${args}`)
    }
}