// const { TelegramClient } = require("telegram");
const { TelegramClient, Api } = require("telegram");
const { StringSession } = require("telegram/sessions");
const { bot } = require("../../server");
const { SaveSession } = require("../utils/saveSession");
// const api = require("./API");
// const input = require("input"); // npm i input
// const { StringSession } = require("telegram/sessions");

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

function connectAsUser(idFromUser) {
    let session = ''
    
    const filePath = SaveSession.checkSessionExist()
    const result = SaveSession.loadSession(filePath)
    const IdDetected = result.filter(({id}) => id == idFromUser)[0]

    if (IdDetected) {
        session = IdDetected.session
    }
    console.log(IdDetected);

    const client = new TelegramClient(new StringSession(session), process.env.APPID, process.env.APPHASH, {
        connectionRetries: 5,
    });

    return { client }
}

async function sendCode(client, phoneNumber) {
    if (phoneNumber == null || phoneNumber == undefined) {
        console.log('PhoneNumber has ',  phoneNumber);
        return
    };

    const resultCodeHash = await client.sendCode({
        apiHash: 'd7484191ce14a0ab151857143e11701f',
        apiId: 20450718
    }, phoneNumber)

    console.log(resultCodeHash);
    return resultCodeHash
}

async function signIn(client, codeAuth) {
    /** contents of the codeAuth are
     * {
     *  phoneCodeHash, 
     *  yourCodeFromTelegram, 
     *  phoneNumber
     * }
     */
    if (codeAuth.code == null || codeAuth.code == undefined) {
        console.log('codeAuth has ',  codeAuth.code);
        return
    };

    await client.invoke(
        new Api.auth.SignIn({
            phoneNumber: codeAuth.phoneNumber,
            phoneCodeHash: codeAuth.phoneCodeHash,
            phoneCode: codeAuth.code.toString('utf-8')
        })
    )
}

module.exports = { sendCode, signIn, connectAsUser } 