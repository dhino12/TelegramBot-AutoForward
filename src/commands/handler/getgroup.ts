/* eslint-disable prettier/prettier */
import { Context } from "grammy";
import { MyContext } from "../../core/bot";
import * as textHelp from "../../utils/textHelp.json";
import { getGroup } from "../middleware";

const getgroup = async (ctx: Context): Promise<void> => {
    await ctx.reply(textHelp.textGetGroup);
    await ctx.reply("🚫 Please wait a moment, don't send anything");
    // await ctx.conversation.enter("getGroup");
    getGroup(ctx)
};

export default getgroup;
