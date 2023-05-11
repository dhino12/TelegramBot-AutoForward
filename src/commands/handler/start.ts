import { MyContext } from "../../core/bot";
import { InlineKeyboard } from "grammy";
import * as textHelp from "../../utils/textHelp.json";

const start = async (ctx: MyContext): Promise<void> => {
    const inlineKeyboard = new InlineKeyboard();
    inlineKeyboard.text("🔂 Koneksi Pertama", "firstconnection").row();
    inlineKeyboard.url("📄 Dokumentasi / Bantuan", "https://github.com/dhino12/TelegramBot-AutoForward").row();

    try {
        await ctx.reply(`Halo ${ctx.from?.first_name || ctx.from?.username} 👋.\n${textHelp.started}`, {
            reply_markup: inlineKeyboard,
        });
    } catch (error) {
        console.error("start error");
        console.error(error);
    }
};

export default start;
