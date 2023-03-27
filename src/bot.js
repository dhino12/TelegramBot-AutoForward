const { createConversation } = require("@grammyjs/conversations");
const { bot, grammy } = require("../server");
const { signIn, sendCode, authImportSession } = require("./handler/auth");
const { signInUser } = require("./middlewares");
// require('./handler/auth')
let userInfo = null // <= information about phone_code, phone_number

bot.command('start', async (context) => {
    const inlineKeyboard = new grammy.InlineKeyboard()
    inlineKeyboard.text('Koneksi Pertama', 'firstconnection')
    inlineKeyboard.text('Dokumentasi / Bantuan', 'documentation')

    bot.api.sendMessage(context.chat.id, `
        Halo Selamat Datang, ${context.chat.first_name || context.chat.username} 👋.\nini adalah bot forward yang akan membantu kamu untuk meneruskan pesan ke lebih dari 1 chat group / channel, \ngunakan perintah /menu untuk melihat menu
    `, {  
        reply_markup: inlineKeyboard
    })

    context.session.name = 'John Doe';
    context.session.age = 30;
    await authImportSession()
    // Send welcome message
    await context.reply(`Hello, ${context.session.name}!`);
})

bot.command('menu', (context) => {
    const inlineKeyboard = new grammy.InlineKeyboard()
    inlineKeyboard.text('Koneksi Pertama', 'firstconnection')
    inlineKeyboard.text('Dokumentasi / Bantuan', 'documentation')

    bot.api.sendMessage(context.chat.id, `Berikut adalah menu yang tersedia:`, {
        reply_markup: {
            inline_keyboard: [[
                {
                    text: 'Koneksi Pertama',
                    callback_data: 'firstconnection'
                },{
                    text: 'Dokumentasi / Bantuan',
                    callback_data: 'documentation'
                }
            ]],
            resize_keyboard: true,
            one_time_keyboard: true
        }
    })
})

bot.command('connect', async (context) => {
    const item = context.match
    
    if (item.startsWith('+')) {
        await context.conversation.enter('signInUserMiddleware')
    }
})

// bot.command('mycode', async (context) => {

//     console.log('mycode');
//     const item = context.match
//     const result = await signIn(item, userInfo)
//     console.log(result)
//     await context.reply(`Selamat Berhasil autentikasi: ${item}`)
// })

bot.hears('/hi', async (ctx) => {
    await bot.api.sendMessage(ctx.chat.id, 'Hello 👋')
})