import { Context } from "grammy";
import * as textHelp from "../../utils/textHelp.json";
import { login } from "../middleware";
import { toMarkdownV2 } from "../../utils/textManipulation";

const connect = async (ctx: Context): Promise<void> => {
    try {
        if (ctx.match == "") {
            await ctx.reply(toMarkdownV2(textHelp.firstConnection), {
                parse_mode: 'MarkdownV2', disable_web_page_preview: true
            });
            return
        }
        await ctx.reply("⚠ Please wait....");
        const checkSession = await login(ctx)
        if (checkSession?.data != undefined) {
            await ctx.reply("You Are Already Registered 👌\n\n👉 How to get ID ? [Get info channel, groups, user](https://docs-v1.gitbook.io/autoforward-en/overview/get-information-channels-groups-your-account)\n👉 Started with new task? [How to setup new task](https://docs-v1.gitbook.io/autoforward-en/overview/how-to-setup-new-task-auto-forward)", {
                reply_to_message_id: ctx.msg?.message_id, parse_mode: 'Markdown', disable_web_page_preview: true
            });
            return
        }
        await ctx.reply(
            toMarkdownV2("Please enter the user code sent by telegram from the SMS / chat app\n\nFor Example, your login code is 123456 and enter **mycode123456**"), {
                parse_mode: 'Markdown'
            }
        ); 
        console.log('selesai connect()');
        
    } catch (error: any) {
        if (Number.isInteger(error.code) || error.seconds == undefined) {
            await ctx.reply(toMarkdownV2(error?.message || "something wen't wrong"), {
                parse_mode: "MarkdownV2"
            });
        }

        if (error.seconds) {
            await ctx.reply(`FLOOD: you have reached the request limit, wait until ${error.seconds} seconds`);
        }
        console.log("connect: " + error);
        console.log(error);
    }
    
};

export default connect;