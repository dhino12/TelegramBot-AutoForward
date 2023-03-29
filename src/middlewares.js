const { createConversation } = require("@grammyjs/conversations")
const { TelegramClient, Api } = require("telegram")
const { StringSession } = require("telegram/sessions")
const { bot } = require("../server")
const { SaveSession } = require("./utils/saveSession")
let phoneCode = 0
const client = new TelegramClient(new StringSession(''), 20450718, 'd7484191ce14a0ab151857143e11701f', {
    connectionRetries: 5,
});

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
        phoneCode = message.text.replace('mycode', '').trim()
        
        return phoneCode
    } catch (error) {
        console.error(error);
    }

    return null
}

async function login (conversation, context) {
    try {
        console.log("Loading interactive example...");
        
        await client.connect()
        const phoneNumber = await askPhoneNumber(conversation, context)

        if (phoneNumber == null || phoneNumber == undefined) {
            console.log('PhoneNumber has ',  phoneNumber);
            return
        };
        
        const dataPhoneCodeHash = await client.sendCode({
            apiHash: 'd7484191ce14a0ab151857143e11701f',
            apiId: 20450718
        }, phoneNumber)
        console.log(dataPhoneCodeHash);

        const phoneCode = await askPhoneCode(conversation, context)
        console.log(phoneCode);
        
        if (phoneCode == null || phoneCode == undefined) {
            console.log('PhoneCode has ',  phoneCode);
            return
        };
        
        await client.invoke(
            new Api.auth.SignIn({
                phoneNumber,
                phoneCodeHash: dataPhoneCodeHash.phoneCodeHash,
                phoneCode: phoneCode.toString('utf-8')
            })
        )

        let dialogs = await client.getDialogs()
        dialogs = dialogs.map(dialog => ({
            id: dialog.id,
            title: dialog.title,
            isGroup: dialog.isGroup,
            isChannel: dialog.isChannel
        }))

        console.log(client.session.save()); // Save this string to avoid logging in again

        SaveSession.set({
            id: context.from.id,
            phoneNumber,
            session: client.session.save(),
            dialogs,
            isBot: context.from.is_bot
        })
        
        await client.disconnect()
    } catch (error) {
        if (Number.isInteger(error.code) || error.seconds == undefined) {
            context.reply(error.message)
        }

        if (error.seconds) {
            context.reply(`FLOOD: anda sudah mencapai batas, tunggu hingga ${error.seconds} detik`)
        }
    }
}

bot.use(createConversation(login))

module.exports = {
    login
}