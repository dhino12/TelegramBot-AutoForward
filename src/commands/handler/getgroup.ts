/* eslint-disable prettier/prettier */
import { MyContext } from "../../core/bot";
import * as textHelp from "../../utils/textHelp.json";

const getgroup = async (ctx: MyContext): Promise<void> => {
    await ctx.reply(textHelp.textGetGroup);
    await ctx.reply("🚫 Please wait a moment, don't send anything");
    await ctx.conversation.enter("getGroup");
};

export default getgroup;
