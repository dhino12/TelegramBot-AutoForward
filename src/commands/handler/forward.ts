/* eslint-disable prettier/prettier */
import { checkWorker, resultSplitId, saveToStorage } from "../../utils/forwardWorker";
import * as textHelp from "../../utils/textHelp.json";
import validator from "validator"
import { Context, InlineKeyboard } from "grammy";
import deleteForwardByIdHandler from "../../libs/handler/deleteForwardByIdHandler";
import Converstation from "./converstation";

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
                .text("⚙ Setting Forward", "setting_forward")
            await ctx.reply(textHelp.forward, {
                reply_markup: inlineKeyboard
            });
            return 
        }

        if (argAction.includes("add", 0)) {
            await addForward(ctx, {argAction, argLabel, argCommand})
            return;
        }

        if (argAction.includes("remove", 0)) {
            await deleteForward(ctx, argLabel)
            return;
        }

        // if (!argAction.includes("add")) {
        //     await ctx.reply(textHelp.addNotInclude);
        //     return
        // }

    } catch (error) {
        console.log(error);
    }
};

const addForward = async (ctx:Context, {argAction, argLabel, argCommand}) => {
    if (ctx.from == undefined) return
    if (validator.isNumeric(argLabel)) {
        await ctx.reply(textHelp.forwardLabelNotInclude);
        return;
    }

    if (await checkWorker(argLabel, ctx.from.id)) {
        await ctx.reply("Worker sudah tersedia");
        return 
    }

    const { froms, toMany } = resultSplitId(argAction, argLabel, argCommand);
    console.log(froms, toMany);
    const result = await saveToStorage({
        from: froms,
        to: toMany,
        id: `${ctx.from?.id}`,
        name: ctx.from?.first_name,
        worker: argLabel?.toString(),
    });

    if (result) {
        ctx.reply(`Worker Berhasil di simpan`);
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
            
            await deleteForwardByIdHandler(`${ctx.from.id}`, argLabel)
            ctx.reply(`Success Removed Worker: ${argLabel}`, {
                reply_to_message_id: ctx.message?.message_id
            })

            return
        }

        // remove worker with example
            // worker=worker1
        const converstation = new Converstation(ctx)
        const dataUser = await converstation.start()
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