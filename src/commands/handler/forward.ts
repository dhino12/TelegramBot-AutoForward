/* eslint-disable prettier/prettier */
import { checkWorker, resultSplitId, saveToStorage } from "../../utils/forwardWorker";
import { MyContext } from "../../core/bot";
import * as textHelp from "../../utils/textHelp.json";
import validator from "validator"

/**
 * setup forward from -> to [SAVE TO JSON]
 * @param ctx MyContext from converstation core\bot\index.ts
 * @returns Promise<void> 
 */
const forward = async (ctx: MyContext): Promise<void> => { 
    if (ctx.chat?.type != "private") {
        await ctx.reply(textHelp.pleasePrivateChat + ` [${ctx.me.username}](tg://user?id=${ctx.me.id})`, {
            parse_mode: "Markdown",
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
            await ctx.reply(textHelp.forward);
            return 
        }

        if (!argAction.includes("add")) {
            await ctx.reply(textHelp.addNotInclude);
            return
        }

        if (validator.isNumeric(argLabel)) {
            await ctx.reply(textHelp.forwardLabelNotInclude);
            return;
        }

        if (checkWorker(argLabel, ctx.from.id)) {
            await ctx.reply("Worker sudah tersedia");
            return 
        }

        const { froms, toMany } = resultSplitId(argAction, argLabel, argCommand);
        console.log(froms, toMany);
        const result = saveToStorage({
            from: froms,
            to: toMany,
            id: ctx.from?.id,
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
    } catch (error) {
        console.log(error);
    }
};

export default forward;
