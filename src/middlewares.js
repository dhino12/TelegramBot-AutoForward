const { createConversation } = require("@grammyjs/conversations")
const { bot } = require("../server")
const { signIn } = require("./handler/auth")

async function signInUser(conversation, context) {
    await context.reply('Silahkan masukan code user yang dikirim telegram dari SMS / chat app\n\nFor Example, your login code is 123456 dan masukan mycode123456')

    const { message } = await conversation.wait()
    if (message.text.startsWith('mycode')) {
        await context.reply(`code anda ${message.text}`)
        return message.text
    } else {
        await context.reply(`tolong awali dengan mycode<code>`)
    }
}

bot.use(createConversation(signInUser))

module.exports = {
    signInUser
}