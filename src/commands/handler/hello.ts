/* eslint-disable prettier/prettier */
import { Context } from "grammy";

const hello = async (ctx: Context): Promise<void> => {
    await ctx.reply("Hello, world!");
};

export default hello;
