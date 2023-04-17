const grammy = require('grammy')
require('dotenv').config()
const { conversations } = require('@grammyjs/conversations')
const { chatMembers } = require('@grammyjs/chat-members')
const { session, MemorySessionStorage } = require('grammy')
// const {Router} = require('@grammyjs/router')

// const { StringSession } = require('telegram/sessions')
// const { TelegramClient } = require('telegram')
// const { connectAsUser } = require('./src/handler/auth')
// const { SaveStorage } = require('./src/utils/saveStorage')

require('./src/bot')

const bot = new grammy.Bot(process.env.TOKEN)
const adapter = new MemorySessionStorage()
// let client = undefined

// (async function connectToClient() {
//   const stringSession = new StringSession("");
//   client = new TelegramClient(stringSession, parseInt(process.env.APPID), process.env.APPHASH, {
//       connectionRetries: 5,
//   });
//   const filePath = SaveStorage.checkSessionExist('session');
//   const result = SaveStorage.loadSession(filePath);
//   const IdDetected = result.filter(({ id }) => id == context.from.id)[0];
//   if (IdDetected != undefined) {
//       await client.disconnect()
//       client = await connectAsUser(context.from.id)
//   }
// })()
// const router = new Router(async (ctx) => {
//   console.log(ctx.chat.id);
//   console.log(await input.text("Number"));
//   // Tentukan rute yang akan dipilih di sini.
//   return "client";
// });

// router.route("client", (ctx) => {
//   console.log('client triger');
// });

bot.use(session({
    type: "multi",
    custom: {
      initial: () => ({ foo: "" })
    },
    conversation: {}, // bisa dibiarkan kosong
}))
bot.use(conversations())
bot.use(chatMembers(adapter))

// bot.use(router);

bot.init()
    .then(client => {
        console.log(`Berhasil masuk sebagai ${bot.botInfo.username} - ${bot.botInfo.id}`);
    })
    .catch(err => console.error(err))

bot.start()


module.exports = {grammy, bot}