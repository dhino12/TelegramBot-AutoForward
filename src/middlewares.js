const { createConversation } = require("@grammyjs/conversations")
const { bot } = require("../server")
const { SaveStorage } = require("./utils/saveStorage")
const { connectAsUser, sendCode, signIn } = require("./handler/auth")
const { TelegramClient, Api } = require("telegram")
const { StringSession } = require("telegram/sessions")
const { getchanelDB, getgroupDB, getUserDB } = require("./handler/dialogs")
const text = require('../src/data/textHelp.json')
const { NewMessage } = require("telegram/events")
const validator = require('validator')
const locales = require('./data/locale.json')
const { loadWorkers } = require("./handler/forwardWorker")
let phoneCode = 0
let client = new TelegramClient(new StringSession(''), parseInt(process.env.APPID), process.env.APPHASH, {
    connectionRetries: 5,
});

async function askPhoneCode(conversation, context) {
    try {
        await context.reply('Silahkan masukan code user yang dikirim telegram dari SMS / chat app\n\nFor Example, your login code is 123456 dan masukan mycode123456')
        const { message } = await conversation.wait()
        console.log("askPhoneCode: " + message.text);
        phoneCode = message.text.toLowerCase().replace('mycode', '').trim()
        // const authSignin = await signIn({...auth, code: phoneCode.toString('utf-8')})
        
        return phoneCode
    } catch (error) {
        console.error(error);
    }

    return null
}

async function login (conversation, context) {
    try {
        const filePath = SaveStorage.checkSessionExist('session');
        const result = SaveStorage.loadSession(filePath);
        const IdDetected = result.filter(({ id }) => id == context.from.id)[0];
        if (IdDetected != undefined) {
            await client.disconnect()
            client = await connectAsUser(context.from.id)
        }
        console.log("Loading interactive example...");
        await client.connect()
        
        if (await client.isUserAuthorized()) {
            await context.reply('Anda Sudah Login 👌')
            await observeClientChat(context)
            // return await client.disconnect()
            return
        }

        const phoneNumber = context.match
        if (validator.default.isEmpty(phoneNumber) || !validator.default.isMobilePhone(`${phoneNumber.trim()}`)) {
            console.log("PhoneNumber has ", phoneNumber);
            throw {
                code: 404,
                message: "Ooops PhoneNumber is notValid,\nplease follow /connect <phoneNumber>"
            };
        }
        const auth = await client.sendCode({
            apiHash: process.env.APPHASH,
            apiId: parseInt(process.env.APPID)
        }, phoneNumber)

        const phoneCode = await askPhoneCode(conversation, context)

        await client.invoke(
            new Api.auth.SignIn({
                phoneNumber,
                phoneCodeHash: auth.phoneCodeHash,
                phoneCode: phoneCode.toString('utf-8')
            })
        )

        console.log(client.session.save()); // Save this string to avoid logging in again

        SaveStorage.set({ 
            id: context.from.id,
            name: context.from.first_name,
            session: client.session.save(),
            dialogs: [],
            isBot: context.from.is_bot
        }, 'session')
        
        await context.reply('Success !')
        await client.disconnect()
    } catch (error) {
        if (Number.isInteger(error.code) || error.seconds == undefined) {
            await context.reply(error?.message || "something wen't wrong")
        }

        if (error.seconds) {
            await context.reply(`FLOOD: anda sudah mencapai batas, tunggu hingga ${error.seconds} detik`)
        }
        await client.disconnect()
        console.log(error);
    }

    return
}

async function logout (conversation, context)  {
    try {
        const result = SaveStorage.rm(context.from.id, 'session')
        client.invoke(
            new Api.auth.LogOut()
        )
        if (result) {
            context.reply('Session Berhasil dihapus')
        } else {
            context.reply('Ooopss sepertinya anda belum login')
        }
    } catch (error) {
        console.error(error);
    }

    return
}

async function getgroup(conversation, context) {
    try {
        await client.disconnect();
        client = await connectAsUser(context.from.id);
        await client.connect();

        const groupFromDB = getgroupDB(context.from.id)
        if (groupFromDB != "" && context.match != 'update') {
            // check in db
            await client.disconnect()
            return await context.reply(
                text.textGetGroup + groupFromDB.toString().replaceAll(",", ""), 
                {
                    parse_mode: "Markdown"
                })
        }
        
        // create newDialogs in session.js
        let dialogs = await client.getDialogs();
        const groups = []
        dialogs = dialogs.map(dialog => {
            if (!dialog.isChannel && dialog.isGroup == true) {
                groups.push({
                    id: dialog.id,
                    folderId: Math.abs(dialog.id),
                    title: dialog.title,
                    isGroup: dialog.isGroup,
                    isChannel: dialog.isChannel
                })
                
                return `[${dialog.title}](https://t.me/c/${Math.abs(dialog.id)}/999999999) => ${dialog.id}\n`
            }
        });

        // save to storage
        await SaveStorage.updateDialogs(context.from.id, 'session', groups);
        await context.reply(
            text.textGetGroup + dialogs.toString().replaceAll(',', ''), 
            {parse_mode: "Markdown"}
        );
    } catch (error) {
        if (error.code) {
            context.reply(error.message)
        }
        console.log(error);
    }
    await client.disconnect()
    return 
}

async function getchannel(conversation, context) {
    try {
        await client.disconnect();
        client = await connectAsUser(context.from.id);
        await client.connect();

        const channelDB = getchanelDB(context.from.id)
        if (channelDB != "" && context.match != 'update') {
            // check in db
            await client.disconnect()
            console.log('if channelDB');
            return await context.reply(
                text.textGetChannel + channelDB.toString().replaceAll(',', ''), 
                {parse_mode: "Markdown"})
        }
        
        // create newDialogs in session.js
        const channels = []
        let dialogs = await client.getDialogs();
        dialogs = dialogs.map(dialog => {
            if (dialog.isChannel) {
                channels.push({
                    id: dialog.id,
                    folderId: Math.abs(dialog.id),
                    title: dialog.title,
                    isGroup: dialog.isGroup,
                    isChannel: dialog.isChannel
                })
                return `[${dialog.title}](https://t.me/c/${Math.abs(dialog.id)}/999999999) => ${dialog.id}`
            }
        })

        // save to storage
        await SaveStorage.updateDialogs(context.from.id, 'session', channels);
        await context.reply(
            text.textGetChannel + dialogs.toString().replaceAll(',', ''),
            {parse_mode: "Markdown"});
    } catch (error) {
        if (error.code) {
            context.reply(error.message)
        }
        console.error(error);
    }
    await client.disconnect()
    return
}

async function getuser(conversation, context) {
    try {
        await client.disconnect();
        client = await connectAsUser(context.from.id);
        await client.connect();

        const userDB = getUserDB(context.from.id)
        if (userDB != "" && context.match != 'update') {
            // check in db
            // await client.disconnect()
            console.log('if userDB');
            return await context.reply(
                text.textGetChannel + userDB.toString().replaceAll(',', ''), 
                {parse_mode: "Markdown"})
        }
        
        // create newDialogs in session.js
        const users = []
        let dialogs = await client.getDialogs();
        dialogs = dialogs.map(dialog => {
            if (dialog.isChannel == false && dialog.isGroup == false) {
                users.push({
                    id: dialog.id,
                    folderId: Math.abs(dialog.id),
                    title: dialog.title,
                    isGroup: dialog.isGroup,
                    isChannel: dialog.isChannel
                })
                return `[${dialog.title}](https://t.me/c/${Math.abs(dialog.id)}/999999999) => ${dialog.id}\n`
            }
        })

        // save to storage
        await SaveStorage.updateDialogs(context.from.id, 'session', users);
        await context.reply(
            text.textGetChannel + dialogs.toString().replaceAll(',', ''),
            {parse_mode: "Markdown"});
    } catch (error) {
        if (error.code) {
            context.reply(error.message)
        }
        console.error(error);
    }
    // await client.disconnect()
    return
}

async function observeClientChat(context){
    try {
        const resultWorker = loadWorkers(context.from.id)[0]
        if (resultWorker == undefined) return;

        for (const from of resultWorker.from) {
            for (const to of resultWorker.to) {
                console.log('masuk for dalam');
                //   await ctx.forwardMessage(to , from)
                client.addEventHandler(async (event) => {
                    const message = event.message
                    
                    if (event.isPrivate) {
                        const getMev2 = await client.getEntity(message.senderId)
                        console.log(message.senderId);
                        console.log(message.message);
                        console.log(message.fromId);
                        console.log(message.id);
                        console.log(message.sender);
                        console.log(getMev2);
                        
                        await bot.api.sendMessage(to, `
                        From: ${getMev2.firstName}\n-----\n${message.message}`)
                        // await context.forwardMessage(2026146290 , Number(message.senderId))
                        //  await bot.api.forwardMessage(2026146290, message.senderId, message.chatId)
                    }
                }, new NewMessage({fromUsers: from}))
            }
        }
    } catch (error) {
     
    } 
}

bot.use(createConversation(login))
bot.use(createConversation(logout))
bot.use(createConversation(getuser))
bot.use(createConversation(getgroup))
bot.use(createConversation(getchannel))

module.exports = {
    login, logout, getgroup, getchannel, getuser, observeClientChat
}