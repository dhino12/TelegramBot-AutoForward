const { createConversation } = require("@grammyjs/conversations")
const { TelegramClient, Api } = require("telegram")
const { sendCode } = require("telegram/client/auth")
const { StringSession } = require("telegram/sessions")
const { bot } = require("../server")
const { connectAsUser, signIn } = require("./handler/auth")
const { SaveSession } = require("./utils/saveSession")

async function askPhoneNumber(conversation, context) {
    try {
        await context.reply('Silahkan masukan nomer HP :')
        const { message } = await conversation.wait()
        console.log(message.text);
        if (message.text.startsWith('+')) {
            await context.reply(`No HP Anda: ${message.text}`)
            return message.text
        }

        return null
    } catch (error) {
        console.error(error);
    }

    return null
}

async function askPhoneCode(conversation, context) {
    try {
        await context.reply('Silahkan masukan code user yang dikirim telegram dari SMS / chat app\n\nFor Example, your login code is 123456 dan masukan mycode123456')
        const { message } = await conversation.wait()
        console.log("askPhoneCode: " + message.text);
        const phoneCode = message.text.replace('mycode', '').trim()
        
        return phoneCode
    } catch (error) {
        console.error(error);
    }

    return null
}

async function loginAsUser(conversation, context) {
    const { client } = connectAsUser(context.from.id)
    console.log("Loading interactive example...");
    try {
        
        await client.connect()
        const phoneNumber = await askPhoneNumber(conversation, context)
        const resultCodeHash = await sendCode(client, phoneNumber)
        const phoneCode = await askPhoneCode(conversation, context)
        // connect as User
        await signIn(client, { 
            phoneCodeHash: resultCodeHash.phoneCodeHash,
            code: phoneCode,
            phoneNumber
        })
        
        let dialogs = await client.getDialogs()
        dialogs = dialogs.map(dialog => ({
            id: dialog.id,
            title: dialog.title,
            isGroup: dialog.isGroup,
            isChannel: dialog.isChannel
        }))

        SaveSession.set({
            id: context.from.id,
            phoneNumber,
            session: client.session.save(),
            dialogs,
            isBot: context.from.is_bot
        })

    } catch (error) {
        if (Number.isInteger(error.code) || error.seconds == undefined) {
            context.reply(error.message)
        }
        if (error.seconds) {
            context.reply(`FLOOD: anda sudah mencapai batas, tunggu hingga ${error.seconds} detik`)
        }
        console.error(error);
    }
    
    client.disconnect()
}

bot.use(createConversation(loginAsUser))

module.exports = { loginAsUser }