const { createConversation } = require("@grammyjs/conversations")
const { bot } = require("../server")
const { SaveStorage } = require("./utils/saveStorage")
const { connectAsUser, sendCode, signIn } = require("./handler/auth")
let phoneCode = 0

async function askPhoneCode(conversation, context, auth) {
    try {
        await context.reply('Silahkan masukan code user yang dikirim telegram dari SMS / chat app\n\nFor Example, your login code is 123456 dan masukan mycode123456')
        const { message } = await conversation.wait()
        console.log("askPhoneCode: " + message.text);
        phoneCode = parseInt(message.text.toLowerCase().replace('mycode', '').trim())
        const authSignin = await signIn({...auth, code: phoneCode.toString('utf-8')})
        
        return authSignin
    } catch (error) {
        console.error(error);
    }

    return null
}

async function login (conversation, context) {
    try {
        const {client} = await connectAsUser(context.from.id)
        console.log("Loading interactive example...");
        await client.connect()
        
        const phoneNumber = context.match

        if (await client.isUserAuthorized()) {
            await context.reply('Anda Sudah Login 👌')
            return await client.disconnect()
        }

        const auth = await sendCode(phoneNumber, context.from.language_code)
        const askCode = await askPhoneCode(conversation, context, {
            ...auth, 
            phoneNumber
        })
        
        let dialogs = await client.getDialogs()
        dialogs = dialogs.map(dialog => ({
            id: dialog.id,
            title: dialog.title,
            isGroup: dialog.isGroup,
            isChannel: dialog.isChannel
        }))

        console.log(client.session.save()); // Save this string to avoid logging in again

        SaveStorage.set({ 
            id: context.from.id,
            name: context.from.first_name,
            session: client.session.save(),
            dialogs,
            isBot: context.from.is_bot
        }, 'session')
        
        await client.disconnect()
    } catch (error) {
        if (Number.isInteger(error.code) || error.seconds == undefined) {
            await context.reply(error?.message || "")
        }

        if (error.seconds) {
            await context.reply(`FLOOD: anda sudah mencapai batas, tunggu hingga ${error.seconds} detik`)
        }
        console.log(error);
    }
}

async function logout (conversation, context)  {
    try {
        const result = SaveStorage.rm(context.from.id, 'session')
        if (result) {
            context.reply('Session Berhasil dihapus')
        } else {
            context.reply('Ooopss sepertinya anda belum login')
        }
    } catch (error) {
        
    }
}

bot.use(createConversation(login))
bot.use(createConversation(logout))

module.exports = {
    login, logout
}