require("dotenv").config();

const production = async (bot) => {
    try {
        await bot.api.setWebhook(`${process.env.VERCEL_URL}/api/index`);
        console.log(`[SERVER] Bot starting webhook`);
    } catch (e) {
        console.error(e);
    }
};

const development = async (bot) => {
    try {
        await bot.api.deleteWebhook();
        console.log("[SERVER] Bot starting polling");
        await bot.start();
    } catch (e) {
        console.error(e);
    }
};

module.exports = { production, development };
