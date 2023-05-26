import { Context } from "grammy";
// import { MyContext } from "../../core/bot";
import * as textHelp from "../../utils/textHelp.json";
import { login } from "../middleware";

const connect = async (ctx: Context): Promise<void> => {
    if (ctx.match == "") {
        await ctx.reply(textHelp.firstConnection);
    }
    await ctx.reply("Mohon tunggu nomer sedang di proses");
    // await ctx.conversation.enter("login");
    await login(ctx)
};

export default connect;
