const { Composer, InlineKeyboard } = require('grammy')
const composer = new Composer();
const textHelp = require("../data/textHelp.json");
const validator = require("validator");
const {
  resultSplitId,
  saveToStorage,
  checkWorker,
  loadWorkers,
} = require("../handler/forwardWorker");
require("./middlewares");
require("../handler/auth");
require("../handler/dialogs");
require("../utils/saveStorage");

composer.command("start", async (context) => {
    const inlineKeyboard = new InlineKeyboard()
    inlineKeyboard.text("🔂 Koneksi Pertama", "firstconnection").row();
    inlineKeyboard
        .url(
        "📄 Dokumentasi / Bantuan",
        "https://github.com/dhino12/TelegramBot-AutoForward"
        )
        .row();

    try {
        await context.reply(
        `
                Halo ${context.chat.first_name || context.chat.username} 👋.\n${textHelp.started}
            `,
        {
            reply_markup: inlineKeyboard,
        }
        );
        // await context.reply("Check out this menu:", { reply_markup: menu });

        console.log(context.from);
    } catch (error) {
        console.error("start error");
        console.error(error);
    }
});

composer.command("menu", async (context) => {
  const inlineKeyboard = new grammy.InlineKeyboard();
  inlineKeyboard.text("Koneksi Pertama", "firstconnection");
  inlineKeyboard.text("Dokumentasi / Bantuan", "documentation");

  await bot.api.sendMessage(
    context.chat.id,
    `Berikut adalah menu yang tersedia:`,
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Koneksi Pertama",
              callback_data: "firstconnection",
            },
            {
              text: "Dokumentasi / Bantuan",
              callback_data: "documentation",
            },
          ],
        ],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    }
  );
});

composer.command("connect", async (context) => {
  await context.reply("Mohon tunggu nomer sedang di proses");
  await context.conversation.enter("login");
});

composer.command("logout", async (context) => {
  await context.reply("Mohon tunggu nomer sedang di proses");
  await context.conversation.enter("logout");
});

composer.command("getchanel", async (context) => {
  await context.reply("🚫 Please wait a moment, don't send anything");
  await context.conversation.enter("getchannel");
});

composer.command("getuser", async (context) => {
  await context.reply("🚫 Please wait a moment, don't send anything");
  await context.conversation.enter("getuser");
});

composer.command("getgroup", async (context) => {
  await context.reply("🚫 Please wait a moment, don't send anything");
  await context.conversation.enter("getgroup");
});

composer.command("forward", async (context) => {
  if (context.chat.type != "private")
    return await context.reply(
      textHelp.pleasePrivateChat +
        ` [${context.me.username}](tg://user?id=${context.me.id})`,
      {
        parse_mode: "Markdown",
      }
    );

  const argCommand = context.match.toLowerCase().replace(/\s+/g, " ").trim();
  const argAction = argCommand.split(" ")[0]; // ACTION
  const argLabel = argCommand.split(" ")[1]; // LABEL / WORKER

  try {
    if (argCommand == "") {
      return await context.reply(textHelp.forward);
    }

    if (!argAction.includes("add"))
      return await context.reply(textHelp.addNotInclude);

    if (validator.default.isNumeric(argLabel))
      return await context.reply(textHelp.forwardLabelNotInclude);

    if (checkWorker(argLabel, context.from.id)) {
      return await context.reply("Worker sudah tersedia");
    }

    const { from, to } = resultSplitId(argAction, argLabel, argCommand);
    console.log(from, to);
    const result = saveToStorage({
      from,
      to,
      id: context.from.id,
      name: context.from.first_name,
      worker: argLabel.toString(),
    });

    if (result) return context.reply(`Worker Berhasil di simpan`);
    else
      return context.reply(
        `Mohon maaf terjadi kesalahan, pastikan sesuai dengan format`
      );
  } catch (error) {
    console.log(error);
  }
});

composer.hears("/hi", async (ctx) => {
  try {
    await ctx.reply("Hello 👋");
  } catch (error) {}
});

composer.on("msg", async (ctx) => {
  // console.log(ctx.chat);
  try {
    switch (ctx.chat.type) {
      case "channel":
        console.log(ctx.from);
        break;
      case "supergroup":
        const resultWorker = loadWorkers(ctx.from.id)[0];
        if (resultWorker == undefined) return;

        for (const from of resultWorker.from) {
          for (const to of resultWorker.to) {
            await ctx.forwardMessage(to, from);
          }
        }
        break;
      case "group":
        break;
      case "private":
        console.log(ctx.message.text);
        break;
      default:
        break;
    }
    // console.log(await ctx.exportChatInviteLink());
  } catch (error) {}
});

composer.on('callback_query:data', async (ctx) => {
    const callbackData = ctx.callbackQuery.data
    switch (callbackData) {
        case 'firstconnection':
            ctx.reply(textHelp.firstConnection)
            break;
    
        default:
            break;
    }
    await ctx.answerCallbackQuery();
})
module.exports = composer