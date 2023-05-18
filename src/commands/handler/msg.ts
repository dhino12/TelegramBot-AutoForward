/* eslint-disable prettier/prettier */
import { loadWorkers } from "../../utils/forwardWorker";
import { MyContext } from "../../core/bot";

const msg = async (ctx: MyContext): Promise<void> => {
  // console.log(ctx.chat);
  try {
    if (ctx.chat == undefined) throw { code: 404, message: "chatType not found" }
    if (ctx.from == undefined) throw { code: 404, message: "chat id not found" }
    if (ctx.message == undefined) throw { code: 404, message: "chatMessage not found" }
    console.log('masuk');
    
    const resultWorker = loadWorkers(ctx.from.id)[0];
    switch (ctx.chat.type) {
      case "channel":
        console.log(ctx.from);
        break;
      case "supergroup":
        if (resultWorker == undefined) return;

        for (const from of resultWorker.from) {
          for (const to of resultWorker.to) {
            console.log(to);
            
            await ctx.forwardMessage(to, from);
          }
        }
        break;
      case "group":
        console.log("grup: " + ctx.message.text);
        if (resultWorker == undefined) return;

        for (const from of resultWorker.from) {
          for (const to of resultWorker.to) {
            console.log(to);

            await ctx.forwardMessage(to, from);
          }
        }
        break;
      case "private":
        console.log(`pc: ${ctx.message.text}`);
        break;
      default:
        break;
    }
    // console.log(await ctx.exportChatInviteLink());
  } catch (error) {
    console.error(error);
    
  }
};

export default msg;
