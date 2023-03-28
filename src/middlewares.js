const { createConversation } = require("@grammyjs/conversations")
const { TelegramClient, Api } = require("telegram")
const { StringSession } = require("telegram/sessions")
const { bot } = require("../server")
const { sendCode, signIn } = require("./handler/auth")
const input = require('input')
let phoneCode = 0

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
        const stringSession = new StringSession("");
        const client = new TelegramClient(stringSession, 20450718, 'd7484191ce14a0ab151857143e11701f', {
            connectionRetries: 5,
        });
        
        await client.connect()
        const phoneNumber = await askPhoneNumber(conversation, context)
        
        await client.start({
            phoneNumber: async () => await askPhoneNumber(conversation, context),
            password: async () => await input.text("password?"),
            phoneCode: async () => {
                await askPhoneCode(conversation, context)
                console.log("askPhoneCode: " + phoneCode);
                return phoneCode || true
            },
            onError: (err) => console.log(err),
        }); 

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
        
        // await client.invoke(
        //     new Api.auth.SignIn({
        //         phoneNumber,
        //         phoneCodeHash: data.phoneCodeHash,
        //         phoneCode
        //     })
        // )

        await client.signInUser({
            apiHash: 'd7484191ce14a0ab151857143e11701f',
            apiId: 20450718,
        }, {
            phoneNumber,
            phoneCode,
            onError: (error) => console.log(`Error adalah: `, error)
        })
        // const dialogs = await client.getDialogs()
        // dialogs.forEach(dialog => console.log(dialog))

        // await client.start({
        //     phoneNumber,
        //     password: async () => await input.text("password?"),
        //     phoneCode: async () => await input.text("Code? "),
        //     onError: (err) => console.log(err),
        // });
        // console.log("You should now be connected.");
        console.log(client.session.save()); // Save this string to avoid logging in again
        // return data
        // await client.disconnect()
    } catch (error) {
        console.error(error);
        context.reply(`FLOOD: anda sudah batas tunggu hingga ${error.seconds} detik`)
    }
}

bot.use(createConversation(login))

module.exports = {
    login
}