/* eslint-disable prettier/prettier */
import { Context } from "grammy";
import { getUser } from "../middleware";
// import { MyContext } from "../../core/bot";

const getuser = async (ctx: Context): Promise<void> => {
    await ctx.reply("🚫 Please wait a moment, don't send anything");
    // await ctx.conversation.enter("getUser");
    await getUser(ctx)
};

export default getuser;
