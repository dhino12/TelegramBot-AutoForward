const { bot } = require("../../server");
const api = require("./API");

bot.callbackQuery('firstconnection', (context) => {
    bot.api.sendMessage(context.chat.id,  `
    *\\Connect Help Menu*\\

    Use it to connect your account with Auto Forward Message Telegram Bot\\, You will need at least one connected account with Auto Forward Message Telegram Bot to use other commands
    
    Enter the phone number of the telegram account which is already a member of the desired source chats\\, along with country code
    
    *\\Command Arguments*\\
    \\/connect PHONE\\_NUMBER
    
    *\\For Example:*\\
    \\/connect \\+84444444444
    
    You can find every country prefix code by 
    
    Don't know how to start 🤔🤔🤔? 
    👉`, {
        parse_mode: 'MarkdownV2'
    })
})

bot.callbackQuery('documentation', (ctx) => {
    ctx.reply(`Untuk melihat dokumentasi silahkan ke [dokumentasi](google.com)`)
})

const sendCode = async (phone_number) => {
    let data = null

    try {
        data = await api.call('auth.sendCode', {
            phone_number,
            settings: {
              _: 'codeSettings',
            },
            
        });

    } catch (error) {
        console.error(error);
    }
    
    return {...data, phone_number} // < phoce_code, phone_number
}

const signIn = async (mycode, yourInfo) => {
    return api.call('auth.signIn', {
        phone_code: mycode,
        phone_number: yourInfo.phone_number,
        phone_code_hash: yourInfo.phone_code_hash
    })
}

module.exports = { sendCode, signIn }