/* eslint-disable prettier/prettier */
import { Context } from "grammy";
import { signIn } from "../middleware";

const signInUser = async (ctx: Context): Promise<void> => {
    try {
        await ctx.reply("🚫 Please wait a moment, don't send anything");
        const result = await signIn(ctx)
        if (result == undefined) return
        await ctx.reply("Success !\nSelamat Datang: " + result.data.name, {
            reply_to_message_id: ctx.msg?.message_id
        });
    } catch (error: any) {
        
        ctx.reply(error.message)
    }
};

export default signInUser;
