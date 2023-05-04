require('dotenv').config()
const commands = require('./commands')
const bot = require("./core/bot")
const { development, production } = require('./utils/launch')

process.env.NODE_ENV === "development" ? development(bot) : production(bot);
bot.use(commands);

module.exports = {}