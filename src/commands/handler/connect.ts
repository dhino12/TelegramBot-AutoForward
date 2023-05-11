import { MyContext } from "../../core/bot";
import * as textHelp from "../../utils/textHelp.json";

const connect = async (ctx: MyContext): Promise<void> => {
    if (ctx.match == "") {
        await ctx.reply(textHelp.firstConnection);
    }
    await ctx.reply("Mohon tunggu nomer sedang di proses");
    await ctx.conversation.enter("login");
};

export default connect;
