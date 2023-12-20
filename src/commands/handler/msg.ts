/* eslint-disable prettier/prettier */
import { Context } from "grammy";
import { signIn } from "../middleware";
import getAllForwardsHandler from "../../libs/handler/getAllForwardsHandler";

const forwardTo = async (forwardWorker: { from: []; to: [] }[], ctx: Context) => {
    // console.log(ctx.message);

    for (const dataUser of forwardWorker) {
        for (const from of dataUser.from) {
            // if (ctx.chat?.id == from) continue
            for (const to of dataUser.to) {
                console.log(to);
                try {
                    await ctx.forwardMessage(to, from);
                } catch (error) {
                    console.error(error);
                    await ctx.reply("it looks like the bot is not an admin in the channel with id " + to);
                }
            }
        }
    }
};

const msg = async (ctx: Context): Promise<void> => {
    try {
        if (ctx.chat == undefined) throw { code: 404, message: "chatType not found" };
        if (ctx.from == undefined) throw { code: 404, message: "chat id not found" };
        if (ctx.message == undefined) throw { code: 404, message: "chatMessage not found" };
        console.log(ctx.chat.id);

        const { data } = await getAllForwardsHandler(ctx.chat.id.toString());
        if (data == undefined) return;
        console.log("masuk " + ctx.from.first_name + ` ${ctx.from.id}`);

        switch (ctx.chat.type) {
            case "channel":
                forwardTo(data, ctx);
                break;
            case "supergroup":
                forwardTo(data, ctx);
                break;
            case "group":
                forwardTo(data, ctx);
                break;
            case "private":
                // forwardTo(resultWorker, ctx)
                console.log("masuk private: ", ctx.message.text);
                if (ctx.message.text?.includes("mycode")) {
                    signIn(ctx);
                    break;
                }
                forwardTo(data, ctx);
                break;
            default:
                break;
        }
    } catch (error) {
        console.error(error);
    }
};

export default msg;
