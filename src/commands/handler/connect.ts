import { Context } from "grammy";
import * as textHelp from "../../utils/textHelp.json";
import { login } from "../middleware";

const connect = async (ctx: Context): Promise<void> => {
    try {
        if (ctx.match == "") {
            await ctx.reply(textHelp.firstConnection);
        }
        await ctx.reply("Mohon tunggu nomer sedang di proses");
        const checkSession = await login(ctx)
        if (checkSession?.data != undefined) {
            await ctx.reply("Anda Sudah Terdaftar 👌", {
                reply_to_message_id: ctx.msg?.message_id
            });
            return
        }
        await ctx.reply(
            "Silahkan masukan code user yang dikirim telegram dari SMS / chat app\n\nFor Example, your login code is 123456 dan masukan mycode123456",
        );
        
        console.log('selesai connect()');
        
    } catch (error: any) {
        if (Number.isInteger(error.code) || error.seconds == undefined) {
            await ctx.reply(error?.message || "something wen't wrong");
        }

        if (error.seconds) {
            await ctx.reply(`FLOOD: anda sudah mencapai batas, tunggu hingga ${error.seconds} detik`);
        }
        console.log("connect: " + error);
        console.log(error);
    }
    
};

export default connect;