const { bot, grammy } = require("../server");
const textHelp = require("./data/textHelp.json");
const { SaveStorage } = require("./utils/saveStorage");
const validator = require("validator");
const { resultSplitId, saveToStorage, checkWorker, loadWorkers } = require("./handler/forwardWorker");
const { connectAsUser } = require("./handler/auth");
require("./middlewares");

bot.command("start", async (context) => {
  const inlineKeyboard = new grammy.InlineKeyboard();
  inlineKeyboard.text("Koneksi Pertama", "firstconnection");
  inlineKeyboard.text("Dokumentasi / Bantuan", "documentation");
  console.log(context.chat.id);
  try {
    await bot.api.sendMessage(
      context.chat.id,
      `
            Halo Selamat Datang, ${
              context.chat.first_name || context.chat.username
            } 👋.\nini adalah bot forward yang akan membantu kamu untuk meneruskan pesan ke lebih dari 1 chat group / channel, \ngunakan perintah /menu untuk melihat menu
        `,
      {
        reply_markup: inlineKeyboard,
      }
    );

    console.log(context.from);
  } catch (error) {
    console.error("start error");
    console.error(error);
  }
});

bot.command("menu", async (context) => {
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

bot.command("connect", async (context) => {
  context.reply('Mohon tunggu nomer sedang di proses')
  await context.conversation.enter("login");
});

bot.command("getchanel", async (context) => {
  const filePath = SaveStorage.checkSessionExist('session');
  const sessionData = SaveStorage.loadSession(filePath);
  const searchSessionCurrent = sessionData.filter(
    ({ id }) => id == context.from.id
  )[0];
  const searchChannel = searchSessionCurrent.dialogs.filter(
    ({ isChannel }) => isChannel == true
  );
  console.log(searchChannel);
  if (searchSessionCurrent == undefined)
    return context.reply(`
            Sepertinya anda belum login ${context.from.first_name},
            gunakan /connect untuk login
        `);
  return await context.reply(`
  🚫 Please wait a moment, this may take a few minutes. In the meantime, don't send too many similar requests. 🚫
Chanel Title —» ID
${searchChannel.map(item => `${item.title} => ${item.id}\n`)}
  `)
});

bot.command('getgroup', async (context) => {
  const filePath = SaveStorage.checkSessionExist('session');
  const sessionData = SaveStorage.loadSession(filePath)
  const searchSessionCurrent = sessionData.filter(
    ({id}) => id == context.from.id
  )[0]
  const searchGroup = searchSessionCurrent.dialogs.filter(
    ({isGroup}) => isGroup == true
  )
  if (searchSessionCurrent == undefined)
    return context.reply(`
            Sepertinya anda belum login ${context.from.first_name},
            gunakan /connect untuk login
        `);
  console.log(searchGroup);
  return await context.reply(`
  🚫 Please wait a moment, this may take a few minutes. In the meantime, don't send too many similar requests. 🚫
  Group Title —» ID 
  ${searchGroup.map(item => `${item.title} => ${item.id}\n`)}
  `)  
})

bot.command("forward", async (context) => {
  const argCommand = context.match.toLowerCase();
  const argAction = argCommand.split(" ")[0]; // ACTION
  const argLabel = argCommand.split(" ")[1]; // LABEL / WORKER
  
  if (argCommand == "") {
    return await context.reply(textHelp.forward);
  }

  if (!argAction.includes("add")) 
     return await context.reply(textHelp.addNotInclude);

  if (validator.default.isNumeric(argLabel))
    return await context.reply(textHelp.forwardLabelNotInclude);

  if (checkWorker(argLabel, context.from.id)) {
    return await context.reply('Worker sudah tersedia')
  }

  const { from, to } = resultSplitId(argAction, argLabel, argCommand);
  console.log(from,to);
  const result = saveToStorage({
    from, to, 
    id: context.from.id, name: context.from.first_name,
    worker: argLabel.toString()
  })

  if (result) return context.reply(`Worker Berhasil di simpan`)
  else return context.reply(`Mohon maaf terjadi kesalahan, pastikan sesuai dengan format`)
});

bot.on('msg', async (ctx) => {
  console.log(ctx.chat);
  try {
    switch (ctx.chat.type) {
      case 'channel':
        console.log(ctx.from);
        break;
      case 'supergroup':
        const resultWorker = loadWorkers(ctx.from.id)[0]
        console.log(resultWorker);
        if (resultWorker == undefined) return;

        for (const from of resultWorker.from) {
          for (const to of resultWorker.to) {
            ctx.forwardMessage(to , from)
          }
        }
        break
      case 'group': 
        console.log(ctx.from);
        break
      case 'private':

        break
      default:
        break;
    }
  } catch (error) {
    
  }
})

bot.hears("/hi", async (ctx) => {
  try {
    console.log(ctx.message);
    await ctx.reply("Hello 👋");

  } catch (error) {
  }
});