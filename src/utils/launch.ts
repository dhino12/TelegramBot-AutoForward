import { Bot, Context, webhookCallback } from "grammy";
import express from "express";

const production = async (bot: Bot<Context>): Promise<void> => {
    try {
        const app = express();
        app.use(express.json());
        app.use(webhookCallback(bot, "express"));

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Bot listening on port ${PORT}`);
        });
        console.log(`[SERVER] Bot starting webhook`);
    } catch (e) {
        console.error(e);
    }
};

const development = async (bot: Bot<Context>): Promise<void> => {
    try {
        await bot.api.deleteWebhook();
        console.log("[SERVER] Bot starting polling");
        await bot.start();
    } catch (e) {
        console.error(e);
    }
};

export { production, development };
