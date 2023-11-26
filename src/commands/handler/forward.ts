/* eslint-disable prettier/prettier */
import { checkWorker, resultSplitId, saveToStorage } from "../../utils/forwardWorker";
import * as textHelp from "../../utils/textHelp.json";
import { toMarkdownV2 } from "../../utils/textManipulation";
import deleteForwardByIdHandler from "../../libs/handler/deleteForwardByIdHandler";
import validator from "validator"
import { Context, InlineKeyboard } from "grammy";
import Converstation from "./converstation";
import { startTaskById } from "../middleware";

/**
 * setup forward from -> to [SAVE TO JSON]
 * @param ctx MyContext from converstation core\bot\index.ts
 * @returns Promise<void> 
 */
const forward = async (ctx: Context): Promise<void> => {
    if (ctx.chat?.type != "private") {
        console.log('masuk private');
        await ctx.reply(textHelp.pleasePrivateChat + ` [${ctx.me.username}](tg://user?id=${ctx.me.id})`, {
            parse_mode: "Markdown"
        });
        return;
    }
    const argCommand = ctx.match?.toString().toLowerCase().replace(/\s+/g, " ").trim();
    if (argCommand == undefined || ctx.from == undefined) {
        await ctx.reply("command not found");
        return;
    }
    const argAction = argCommand.split(" ")[0]; // ACTION
    const argLabel = argCommand.split(" ")[1]; // LABEL / WORKER

    try {
        if (argCommand == "") {
            const inlineKeyboard = new InlineKeyboard()
                .text("⚙ Setting Forward", "setting_forward").row()
                .text("👉 Show All Task", "getAllForward").row()
                .text("♻ Restart All Task", "restartAllTask").row()
                .text("🗑 Remove All Task", "removeAllTask").row()
            await ctx.reply(toMarkdownV2(textHelp.forward), {
                reply_markup: inlineKeyboard, parse_mode: 'MarkdownV2', disable_web_page_preview: true
            });
            return 
        }
        
        if (argAction.includes("add", 0)) {
            const lenActionAndLabel = argAction.length + argLabel.length
            const forwardChatId = argCommand.slice(lenActionAndLabel + 1, argCommand.length)
            const from = forwardChatId.split("->")[0].trim();
            const to = forwardChatId.split("->")[1].trim();
            await addForward(ctx, {argLabel, from, to})
            await startTaskById(ctx)
            return;
        }

        if (argAction.includes("remove", 0)) {
            await deleteForward(ctx, argLabel)
            await startTaskById(ctx)
            return;
        }

        if (argAction.includes("start", 0)) {
            await ctx.reply("⚠ Please wait Starting Task....")
            await startTaskById(ctx)
            return;
        } 
    } catch (error: any) {
        console.log(error);
        ctx.reply(toMarkdownV2(error.message), {
            parse_mode: "MarkdownV2"
        })
    }
};

const addForward = async (ctx:Context, {argLabel, from, to}) => {
    if (ctx.from == undefined) return
    if (validator.isNumeric(argLabel)) {
        await ctx.reply(textHelp.forwardLabelNotInclude);
        return;
    }

    console.log(validator.isNumeric(from.split(",")[0]));
    console.log(validator.isNumeric(to.split(",")[0]));
    if (!validator.isNumeric(from.split(",")[0]) || !validator.isNumeric(to.split(",")[0])) {
        await ctx.reply(toMarkdownV2(textHelp.forwardFromAndToNotNumber), {
            parse_mode: 'MarkdownV2'
        });
        return;
    }

    if (await checkWorker(argLabel, ctx.from.id)) {
        await ctx.reply(`Worker with label **${argLabel}** is all ready used`, {
            parse_mode: "Markdown"
        });
        return 
    }

    const { froms, toMany } = resultSplitId(from, to);
    console.log(froms, toMany);
    const result = await saveToStorage({
        from: froms,
        to: toMany,
        id: `${ctx.from?.id}`,
        name: ctx.from?.first_name,
        worker: argLabel?.toString(),
    });

    if (result) {
        ctx.reply(`Worker Successfully Saved`);
        await ctx.reply(toMarkdownV2(textHelp.forwardSuccessfullyAdded + `\nNama: **${argLabel}**\nFrom: **${from}**\nto: **${to}**`), {
            parse_mode: "MarkdownV2"
        })
        return
    }
    else {
        ctx.reply(`Mohon maaf terjadi kesalahan, pastikan sesuai dengan format`);
        return
    }
}

const deleteForward = async (ctx: Context, argLabel: string|undefined) => {
    try {
        
        if (ctx.from == undefined) return
    
        if (argLabel != undefined) {
            // if remove worker with example
                // /forward remove worker1
            console.log('masuk if');
            
            const data = await deleteForwardByIdHandler(`${ctx.from.id}`, argLabel)
            console.log(data);
            
            ctx.reply(`Success Removed Worker: ${argLabel}`, {
                reply_to_message_id: ctx.message?.message_id
            })
            return
        }

        // remove worker with example
            // worker=worker1
        const converstation = new Converstation(ctx)
        const dataUser = await converstation.start()
        console.log(ctx.from?.id);
        console.log(dataUser);
        if (dataUser != undefined) { 
            const workerName = dataUser["mycode"];
            
            await deleteForwardByIdHandler(`${ctx.from.id}`, workerName.split("=")[1])
            ctx.reply(`Success Removed Worker: ${dataUser['mycode']}`, {reply_to_message_id: ctx.message?.message_id})
        }
        await converstation.end()
    } catch (error) {
        console.log(error);
        
    }
}

export { forward, deleteForward };