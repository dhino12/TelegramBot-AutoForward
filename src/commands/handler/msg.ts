/* eslint-disable prettier/prettier */
import { loadWorkers } from "../../utils/forwardWorker";
import { Context } from "grammy";
import { signIn } from "../middleware";

const forwardTo = async (forwardWorker: {from: [], to: []}[], ctx: Context) => {
  console.log(ctx.message);
  
  for (const dataUser of forwardWorker) {
    for (const from of dataUser.from) {
      if (ctx.chat?.id != from) continue
      for (const to of dataUser.to) {
        await ctx.forwardMessage(to, from);
      }
    }
  }
}

const msg = async (ctx: Context): Promise<void> => { 
  try {
    if (ctx.chat == undefined) throw { code: 404, message: "chatType not found" }
    if (ctx.from == undefined) throw { code: 404, message: "chat id not found" }
    if (ctx.message == undefined) throw { code: 404, message: "chatMessage not found" }
    console.log('masuk ' + ctx.from.first_name);
    
    const resultWorker = loadWorkers();
    if (resultWorker == undefined) return;

    switch (ctx.chat.type) {
      case "channel":
        forwardTo(resultWorker, ctx)
        break;
      case "supergroup":
        forwardTo(resultWorker, ctx)
        break;
      case "group":
        forwardTo(resultWorker, ctx)
        break;
      case "private":
        // forwardTo(resultWorker, ctx)
        console.log('masuk private: ', ctx.message.text);
        if (ctx.message.text?.includes("mycode")) {
          signIn(ctx)
        }
        break;
      default:
        break;
    }
  } catch (error) {
    console.error(error);
  }
};

export default msg;
