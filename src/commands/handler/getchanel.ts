/* eslint-disable prettier/prettier */
import { Context } from "grammy";
import * as textHelp from "../../utils/textHelp.json";
import { getChannel } from "../middleware";

const getchanel = async (ctx: Context): Promise<void> => {
    await ctx.reply(textHelp.textGetChannel);
    await ctx.reply("🚫 Please wait a moment, don't send anything");
    // await ctx.conversation.enter("getChannel");
    await getChannel(ctx)
};

export default getchanel;
