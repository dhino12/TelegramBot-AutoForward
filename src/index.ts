import * as dotenv from "dotenv";
dotenv.config();

import commands from "./commands";
import { bot } from "./core/bot";
import { development, production } from "./utils/launch";

bot.use(commands);

process.env.NODE_ENV === "development" ? development(bot) : production(bot);

export {};
