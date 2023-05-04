const { Bot } = require('grammy');

const { conversations } = require('@grammyjs/conversations')
const { chatMembers } = require('@grammyjs/chat-members')
const { session, MemorySessionStorage } = require('grammy')

const bot = new Bot(String(process.env.TOKEN));
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
bot.use()

bot.init()
    .then(client => {
        console.log(`Berhasil masuk sebagai ${bot.botInfo.username} - ${bot.botInfo.id}`);
    })
    .catch(err => console.error(err))

bot.api.setMyCommands([
  { command: "start", description: "Mulai bot ini" },
  { command: "connect", description: "setup account" },
  { command: "forward", description: "setup auto forward" },
  { command: "getuser", description: "Get User ID" },
  { command: "getgroup", description: "Get Group ID" },
  { command: "getchanel", description: "Get Channel ID" },
]);

module.exports = bot;