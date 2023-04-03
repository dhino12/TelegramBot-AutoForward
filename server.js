const grammy = require('grammy')
require('dotenv').config()
const { conversations } = require('@grammyjs/conversations')
const { chatMembers } = require('@grammyjs/chat-members')
const { session, MemorySessionStorage } = require('grammy')

// const { StringSession } = require('telegram/sessions')
// const { TelegramClient } = require('telegram')

require('./src/bot')

// const stringSession = new StringSession("");
// const client = new TelegramClient(stringSession, 20450718, 'd7484191ce14a0ab151857143e11701f', {
//     connectionRetries: 5,
// });
const bot = new grammy.Bot(process.env.TOKEN)
const adapter = new MemorySessionStorage()

bot.use(session({
    type: "multi",
    custom: {
      initial: () => ({ foo: "" })
    },
    conversation: {}, // bisa dibiarkan kosong
}))
bot.use(conversations())
bot.use(chatMembers(adapter))

bot.init()
    .then(client => {
        console.log(`Berhasil masuk sebagai ${bot.botInfo.username} - ${bot.botInfo.id}`);
    })
    .catch(err => console.error(err))

bot.start()


module.exports = {grammy, bot}