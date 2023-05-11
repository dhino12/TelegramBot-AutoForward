/* eslint-disable prettier/prettier */
import { MyContext } from "../../core/bot";

const getuser = async (ctx: MyContext): Promise<void> => {
    await ctx.reply("🚫 Please wait a moment, don't send anything");
    await ctx.conversation.enter("getUser");
};

export default getuser;
