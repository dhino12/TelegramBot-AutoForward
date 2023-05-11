/* eslint-disable prettier/prettier */
import { MyContext } from "../../core/bot";
import * as textHelp from "../../utils/textHelp.json";

const getchanel = async (ctx: MyContext): Promise<void> => {
    await ctx.reply(textHelp.textGetChannel);
    await ctx.reply("🚫 Please wait a moment, don't send anything");
    await ctx.conversation.enter("getChannel");
};

export default getchanel;
