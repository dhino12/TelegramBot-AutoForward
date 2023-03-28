const { TelegramClient } = require("telegram");
const { bot } = require("../../server");
const api = require("./API");
const input = require("input"); // npm i input
const { StringSession } = require("telegram/sessions");

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

// Login as User
const startClient = async () => {
    
}

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
    console.log(yourInfo);
    try {
        const data = await api.call('auth.signIn', {
            phone_code: mycode,
            phone_number: yourInfo.phone_number,
            phone_code_hash: yourInfo.phone_code_hash
        })

        return data
    } catch (error) {
        console.error(error);
    }
}

// async function login (yourInfo) {
//     try {
//         console.log("Loading interactive example...");
//         const stringSession = new StringSession("");
//         const client = new TelegramClient(stringSession, 20450718, 'd7484191ce14a0ab151857143e11701f', {
//             connectionRetries: 5,
//         });
        
//         await client.start({
//             phoneNumber: async () => await input.text("number ?"),
//             password: async () => await input.text("password?"),
//             phoneCode: async () => await input.text("Code ?"),
//             onError: (err) => console.log(err),
//         });
//         console.log("You should now be connected.");
//         console.log(client.session.save()); // Save this string to avoid logging in again
//         await client.sendMessage("me", { message: "Hello!" });
//         // return data
//     } catch (error) {
//         console.error(error);
//     }
// }

module.exports = { sendCode, signIn }