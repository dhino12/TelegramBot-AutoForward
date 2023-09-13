/* eslint-disable prettier/prettier */
import { Context } from "grammy";
import { getUser } from "../middleware";
import { toMarkdownV2 } from "../../utils/textManipulation";

const getuser = async (ctx: Context): Promise<void> => {
    try {
        await ctx.reply("🚫 Please wait a moment, don't send anything");
        // await ctx.conversation.enter("getUser");
        await getUser(ctx)
        await ctx.reply("✅ Done.")
    } catch (error: any) {
        console.log(error);
        await ctx.reply(toMarkdownV2(error.message), {
            parse_mode: 'MarkdownV2', disable_web_page_preview: true
        })
        await ctx.reply("❌ Failed.")
    }
};

export default getuser;
