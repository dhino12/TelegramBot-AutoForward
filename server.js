const grammy = require('grammy')
require('dotenv').config()
const { conversations } = require('@grammyjs/conversations')
const { session } = require('grammy')

require('./src/bot')

const bot = new grammy.Bot(process.env.TOKEN)
bot.api.getMe()
    .then(({username}) => console.log(`Berhasil masuk sebagai ${username}`))
    .catch(e => console.error(e))

bot.use(session({
    initial() {
        return {}
    }
}))

bot.use(conversations())

bot.start()

module.exports = {grammy, bot}