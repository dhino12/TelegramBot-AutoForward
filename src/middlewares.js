const { createConversation } = require("@grammyjs/conversations")
const { TelegramClient } = require("telegram")
const { StringSession } = require("telegram/sessions")
const { bot } = require("../server")
const { sendCode, signIn } = require("./handler/auth")

async function askPhoneNumber(conversation, context) {
    try {
        await context.reply('Silahkan masukan nomer HP :')
        const { message } = await conversation.wait()

        console.log(message.text);
        if (message.text.startsWith('+')) {
            await context.reply(`No HP Anda: ${message.text}`)
            return message.text
        }
    } catch (error) {
        console.error(error);
    }
}

async function askPhoneCode(conversation, context) {
    try {
        await context.reply('Silahkan masukan code user yang dikirim telegram dari SMS / chat app\n\nFor Example, your login code is 123456 dan masukan mycode123456')
        const { message } = await conversation.wait()
        console.log("askPhoneCode: " + message.text);
        const phoneCode = message.text
        return phoneCode
    } catch (error) {
        console.error(error);
    }
}

async function login (conversation, context) {
    try {
        console.log("Loading interactive example...");
        const stringSession = new StringSession("");
        const client = new TelegramClient(stringSession, 20450718, 'd7484191ce14a0ab151857143e11701f', {
            connectionRetries: 5,
        });
        const phoneNumber = await askPhoneCode(conversation, context)
        console.log(typeof phoneNumber);

        // await client.start({
        //     phoneNumber,
        //     password: async () => await input.text("password?"),
        //     phoneCode: async () => await input.text("Code? "),
        //     onError: (err) => console.log(err),
        // });
        // console.log("You should now be connected.");
        // console.log(client.session.save()); // Save this string to avoid logging in again
        // return data
        await client.disconnect()
    } catch (error) {
        console.error(error);
        context.reply(`FLOOD: anda sudah batas tunggu hingga ${error.seconds} detik`)
    }
}

bot.use(createConversation(login))

module.exports = {
    login
}