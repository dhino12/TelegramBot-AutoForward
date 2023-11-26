import { Context } from "grammy";
import { twoFactorAuthentication } from "../middleware";

const twoFactorAuth = async (ctx: Context) => {
    try {
        await ctx.reply("🚫 Please wait a moment, don't send anything");
        await twoFactorAuthentication(ctx)
        await ctx.reply("Success !\nSelamat Datang 👋", {
            reply_to_message_id: ctx.msg?.message_id
        });
    } catch (error) {
        console.log(error);
        ctx.reply("Sorry something problems with 2FA error")
    }
}

export default twoFactorAuth