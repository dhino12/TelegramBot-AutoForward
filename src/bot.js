const { createConversation } = require("@grammyjs/conversations");
const { bot, grammy } = require("../server");
const { signIn, sendCode } = require("./handler/auth");
const { signInUser } = require("./middlewares");
// require('./handler/auth')
let userInfo = null // <= information about phone_code, phone_number

bot.command('start', (context) => {
    const inlineKeyboard = new grammy.InlineKeyboard()
    inlineKeyboard.text('Koneksi Pertama', 'firstconnection')
    inlineKeyboard.text('Dokumentasi / Bantuan', 'documentation')

    bot.api.sendMessage(context.chat.id, `
        Halo Selamat Datang, ${context.chat.first_name || context.chat.username} 👋.\nini adalah bot forward yang akan membantu kamu untuk meneruskan pesan ke lebih dari 1 chat group / channel, \ngunakan perintah /menu untuk melihat menu
    `, {  
        reply_markup: inlineKeyboard
    })
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
        await context.reply(`Nomer telepon ${item} sedang diproses`)
        const data = await sendCode(item)
        userInfo = data
        
        // await context.conversation.enter('signInUser')
        // console.log(context.session.name);
        // bot.on('message:text', (ctx) => {
        //     context
        // })
    }
})

bot.command('mycode', async (context) => {

    const item = context.match
    console.log(userInfo);
    const result = signIn(item, await userInfo)
    console.log(result);
    context.reply('Selamat ')
})

bot.hears('/hi', async (ctx) => {
    await bot.api.sendMessage(ctx.chat.id, 'Hello 👋')
})