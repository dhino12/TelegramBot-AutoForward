// import { MyContext } from "../../core/bot";
import { Context, InlineKeyboard } from "grammy";
import * as textHelp from "../../utils/textHelp.json";
import { startAllTask } from "../middleware";
import { toMarkdownV2 } from "../../utils/textManipulation";

const start = async (ctx: Context): Promise<void> => {
    const inlineKeyboard = new InlineKeyboard();
    inlineKeyboard.text("🔂 First Connection", "firstconnection").row();
    inlineKeyboard.url("📄 Documentation / Help", "https://docs-v1.gitbook.io/autoforward/").row();

    console.log(ctx.match?.toString() != "");
    console.log(ctx.match?.toString() == "alltask");
    
    try {
        if (ctx.match?.toString() != "" && ctx.match?.toString() == "alltask") {
            await startAllTask(ctx)
            
            return
        }
        await ctx.reply(`Halo ${ctx.from?.first_name || ctx.from?.username} 👋.\n${textHelp.started}`, {
            reply_markup: inlineKeyboard, parse_mode: "Markdown", disable_web_page_preview: true
        });
    } catch (error) {
        console.error("start error");
        console.error(error);
    }
};

export default start;
