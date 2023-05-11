import { MyContext } from "../../core/bot";
import * as textHelp from "../../utils/textHelp.json";

const callback_query = async (ctx: MyContext): Promise<void> => {
    const callbackData = ctx.callbackQuery?.data;
    switch (callbackData) {
        case "firstconnection":
            ctx.reply(textHelp.firstConnection);
            break;
        default:
            break;
    }
    await ctx.answerCallbackQuery();
};

export default callback_query;
