require('dotenv').config()
const commands = require('./commands')
const bot = require("./core/bot")
const { development, production } = require('./utils/launch')

bot.use(commands);

process.env.NODE_ENV === "development" ? development(bot) : production(bot);

module.exports = {}