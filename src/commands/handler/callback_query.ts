import { Context, InlineKeyboard } from "grammy";
import * as textHelp from "../../utils/textHelp.json";
import { getAllForwardById } from "../../utils/forwardWorker";
import { toMarkdownV2 } from "../../utils/textManipulation";
import { startTaskById } from "../middleware";

const callback_query = async (ctx: Context): Promise<void> => {
    if (ctx.from == undefined) return console.log('id is empty');
    
    const callbackData = ctx.callbackQuery?.data;
    const updatedKeyboard = new InlineKeyboard()
    switch (callbackData) {
        case "firstconnection":
            ctx.reply(toMarkdownV2(textHelp.firstConnection), {
                parse_mode: "MarkdownV2", disable_web_page_preview: true
            });
            await ctx.editMessageReplyMarkup({reply_markup: updatedKeyboard})
            break;
        case 'setting_forward':
            updatedKeyboard.text("📃 Show All Task", "getAllForward").row()
            updatedKeyboard.text("🗑 Delete Forward", "deleteForward")
            await ctx.editMessageText(toMarkdownV2(textHelp.forward), {
                reply_markup: updatedKeyboard,
                parse_mode: 'MarkdownV2', disable_web_page_preview: true
            })
            break;
        case 'getAllForward':
            const getForwards = await getAllForwardById(`${ctx.from?.id}`)
            let strForwards = "**⏰ Your Forwards List ⏰**\nHere is the list of workers / tasks that you have added\n"
            strForwards += getForwards.map(item => {
                return `=======\nid: ${item.id}\nworkerName: ${item.worker}\nname: ${item.name}\nfrom: [ ${item.from.map(fromForward => `[${fromForward}](https://t.me/c/${Math.abs(fromForward)}/999999999)`)} ]\nto: [ ${item.to.map(toForward => `[${toForward}](https://t.me/c/${Math.abs(toForward)}/999999999)`)} ]\n\n`
            }).toString()
            updatedKeyboard.text("🗑 Delete Forward", "deleteForward").row()
            updatedKeyboard.text("<< Back", "setting_forward")
            await ctx.editMessageText(toMarkdownV2(strForwards.replace(",", "")), {
                reply_markup: updatedKeyboard, parse_mode: 'MarkdownV2'
            })
            break;
        case 'deleteForward':
            updatedKeyboard.text("🗑 Yes, Delete Forward by workerName", "deleteForwardIt").row()
            updatedKeyboard.text("❌ No, back to Setting Forward", "setting_forward")
            await ctx.editMessageReplyMarkup({reply_markup: updatedKeyboard})
            break;
        case 'deleteForwardIt':
            await ctx.reply(toMarkdownV2("Enter workerName Forward **without space** with format \n`worker=<workerName>`\n\n**Example:**\nworker=forward_to_othergroup "), {
                parse_mode: 'MarkdownV2'
            })
            break;
        case 'restartAllTask':
            await ctx.reply("🔄 Please wait Restarting....")
            await startTaskById(ctx)
            break;
        default:
            break;
    }
    await ctx.answerCallbackQuery();
};

export default callback_query;
