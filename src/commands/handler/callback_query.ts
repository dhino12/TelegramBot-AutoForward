import { Context, InlineKeyboard } from "grammy";
import * as textHelp from "../../utils/textHelp.json";
import { getAllForwardById } from "../../utils/forwardWorker";

const callback_query = async (ctx: Context): Promise<void> => {
    if (ctx.from == undefined) return console.log('id is empty');
    
    const callbackData = ctx.callbackQuery?.data;
    const updatedKeyboard = new InlineKeyboard()
    switch (callbackData) {
        case "firstconnection":
            ctx.reply(textHelp.firstConnection);
            await ctx.editMessageReplyMarkup({reply_markup: updatedKeyboard})
            break;
        case 'setting_forward':
            updatedKeyboard.text("📃 Get my Forward", "getAllForward").row()
            updatedKeyboard.text("🗑 Delete Forward", "deleteForward")
            await ctx.editMessageText(textHelp.forward, {reply_markup: updatedKeyboard})
            break;
        case 'getAllForward':
            const getForwards = await getAllForwardById(`${ctx.from?.id}`)
            let strForwards = "📃Berikut adalah daftar worker yang sedang berjalan dan sudah tersimpan\n"
            strForwards += getForwards.map(item => {
                return `=======\nid: ${item.id}\nworkerName: ${item.worker}\nname: ${item.name}\nfrom: [ ${item.from.map(fromForward => `[${fromForward}](https://t.me/c/${Math.abs(fromForward)}/999999999)`)} ]\nto: [ ${item.to.map(toForward => `[${toForward}](https://t.me/c/${Math.abs(toForward)}/999999999)`)} ]\n\n`
            }).toString()
            updatedKeyboard.text("🗑 Delete Forward", "deleteForward").row()
            updatedKeyboard.text("<< Back", "setting_forward")
            await ctx.editMessageText(strForwards.replace(",", ""), {reply_markup: updatedKeyboard, parse_mode: 'Markdown'})
            break;
        case 'deleteForward':
            updatedKeyboard.text("🗑 Yes, Delete Forward by workerName", "deleteForwardIt").row()
            updatedKeyboard.text("❌ No, back to Setting Forward", "setting_forward")
            await ctx.editMessageReplyMarkup({reply_markup: updatedKeyboard})
            break;
        case 'deleteForwardIt':
            await ctx.reply("Masukan workerName Forward dengan format \n worker=<workerName>: ")
            break;
        default:
            break;
    }
    await ctx.answerCallbackQuery();
};

export default callback_query;
