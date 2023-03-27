const { createConversation } = require("@grammyjs/conversations")
const { bot } = require("../server")
const { sendCode, signIn } = require("./handler/auth")

async function sendCodeMiddleware(conversation, context) {
    try {
        await context.reply('Silahkan masukan nomer HP :')
        const { message } = await conversation.wait()

        if (message.text.startsWith('+')) {
            await context.reply(`No HP Anda: ${message.text}`)
            const resultAuth = await sendCode(message.text)
            return resultAuth
        }
    } catch (error) {
        console.error(error);
    }
}

async function signInUserMiddleware(conversation, context) {
    let authData = await sendCodeMiddleware(conversation, context);
    console.log(authData);
    if (authData) {
        await context.reply('Silahkan masukan code user yang dikirim telegram dari SMS / chat app\n\nFor Example, your login code is 123456 dan masukan mycode123456')
        const { message } = await conversation.wait()
        
        if (message.text.startsWith('mycode')) {
            await context.reply(`code anda ${message.text}`)
            authData = await signIn(message.text, authData)
            console.log(authData);
            await context.reply(`Success Authentication ${authData.user.username}`)
        } else {
            await context.reply(`tolong awali dengan mycode<code>`)
        }
    }
}

bot.use(createConversation(signInUserMiddleware))

module.exports = {
    signInUserMiddleware
}