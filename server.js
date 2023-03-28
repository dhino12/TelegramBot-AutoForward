const grammy = require('grammy')
require('dotenv').config()
const { conversations } = require('@grammyjs/conversations')
const { chatMembers } = require('@grammyjs/chat-members')
const { session, MemorySessionStorage } = require('grammy')

require('./src/bot')

const bot = new grammy.Bot(process.env.TOKEN)
const adapter = new MemorySessionStorage()
bot.use(session({
    initial() {
        return {}
    }
}))

bot.use(conversations())
bot.use(chatMembers(adapter))

bot.start()

bot.api.getMe()
    .then(({username}) => console.log(`Berhasil masuk sebagai ${username}`))
    .catch(err => console.error(err))

module.exports = {grammy, bot}