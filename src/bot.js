const { bot, grammy } = require("../server");
require('./middlewares')

bot.command('start', async (context) => {
    const inlineKeyboard = new grammy.InlineKeyboard()
    inlineKeyboard.text('Koneksi Pertama', 'firstconnection')
    inlineKeyboard.text('Dokumentasi / Bantuan', 'documentation')
    console.log(context.chat.id);
    try {
        await bot.api.sendMessage(context.chat.id, `
            Halo Selamat Datang, ${context.chat.first_name || context.chat.username} 👋.\nini adalah bot forward yang akan membantu kamu untuk meneruskan pesan ke lebih dari 1 chat group / channel, \ngunakan perintah /menu untuk melihat menu
        `, {  
            reply_markup: inlineKeyboard
        })
        
        // saveSession('', '')

    } catch (error) {
        console.error('start error');
        console.error(error);
    }
})

bot.command('menu', async (context) => {
    const inlineKeyboard = new grammy.InlineKeyboard()
    inlineKeyboard.text('Koneksi Pertama', 'firstconnection')
    inlineKeyboard.text('Dokumentasi / Bantuan', 'documentation')

    await bot.api.sendMessage(context.chat.id, `Berikut adalah menu yang tersedia:`, {
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
    
    await context.conversation.enter('loginAsUser')
    if (item.startsWith('+')) {
        // console.log(data);
    }
})

// bot.on('message:text', async (context) => {
//     const item = context.match
//     const data = await context.getChat()
//     console.log(data);
// })

// bot.on('message::')
// bot.command('mycode', async (context) => {

//     console.log('mycode');
//     const item = context.match
//     const result = await signIn(item, userInfo)
//     console.log(result)
//     await context.reply(`Selamat Berhasil autentikasi: ${item}`)
// })


// bot.on('msg', async (ctx) => {
    // console.log(ctx.from);
    // console.log(ctx.chat.id);
    // console.log(await ctx.api.getChat(ctx.chat.id));
    // console.log(ctx.message.text);
    // ctx.forwardMessage(-993081767, ctx.chat.id)
    // const chatMember = await ctx.chatMembers.getChatMember();

    
    // return ctx.reply(
    //     `Hello, ${chatMember.user.first_name}! I see you are a ${chatMember.status} of this chat!`,
    // );
// })


bot.hears('/hi', async (ctx) => {
    try {
        await ctx.reply('Hello 👋')

        console.log(ctx.from);
    } catch (error) {
        console.error(error);
    }
})