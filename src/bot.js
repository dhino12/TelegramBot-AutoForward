const { bot, grammy } = require("../server");
const textHelp = require("./data/textHelp.json");
const { SaveStorage } = require("./utils/saveStorage");
const validator = require("validator");
const { resultSplitId, saveToStorage, checkWorker, loadWorkers } = require("./handler/forwardWorker");
const { loginAsUser } = require("./middlewares");
const { createConversation } = require("@grammyjs/conversations");
const { connectAsUser } = require("./handler/auth");
const { Api } = require("telegram");
let client = null
let auth = null
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
  // client = await (await connectAsUser(context.from.id)).client
  // await client.connect()

  // if (await client.isUserAuthorized()) {
  //   context.reply('Anda Sudah Login')
  // }
  
  // if (validator.default.isMobilePhone(context.match)) {
  //   auth = await client.sendCode({
  //     apiHash: process.env.APPHASH,
  //     apiId: parseInt(process.env.APPID)
  //   }, context.match.toString())
  //   console.log(auth);
  //   auth = new Promise((resolve, reject) => {
  //     resolve({...auth, phoneNumber: context.match})
  //   })
  // }
  context.reply('Mohon tunggu nomer sedang di proses')
  await context.conversation.enter("login");
});

bot.command('mycode', async (context) => {
  const code = context.match
  console.log(await auth);
  if (await auth) {
    const {phoneCodeHash, phoneNumber} = await auth

    client.invoke(
      new Api.auth.SignIn({
        phoneCode: code,
        phoneNumber, phoneCodeHash
      })
    )
    console.log(client.session.save());
    client.disconnect()
  }
})

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
  saveToStorage({
    from, to, 
    id: context.from.id, name: context.from.first_name,
    worker: argLabel.toString()
  })
});

// bot.on('message:text', async (context) => {
//     const item = context.match
//     const data = await context.getChat()
//     console.log(data);
// })

// bot.on('message::')
// bot.command('mycode', async (context) => {

//     console.log('mycode');
//     const item = context.match
//     const result = await signIn(item, userInfo)
//     console.log(result)
//     await context.reply(`Selamat Berhasil autentikasi: ${item}`)
// })

bot.on('msg', async (ctx) => {
    // console.log(ctx.from);
    console.log(ctx.chat.id);
    // console.log(await ctx.api.getChat(ctx.chat.id));
    console.log(ctx.chat);
    const resultWorker = loadWorkers(ctx.from.id)[0]
    console.log(resultWorker);
    if (resultWorker == undefined) return;

    switch (true) {
      case (resultWorker.from.length == 1 && resultWorker.to.length == 1):
        console.log('masuk 1');
        ctx.forwardMessage(resultWorker.to[0], resultWorker.from[0])
        break;
    
      case (resultWorker.from.length <= 2 && resultWorker.to.length == 1): 
        for (const iterator of resultWorker.from) {
          ctx.forwardMessage(iterator, resultWorker.to[0])
        }
        break
      case (resultWorker.from.length <= 2 && resultWorker.to.length <= 2): 
        for (const from of resultWorker.from) {
          for (const to of resultWorker.to) {
            ctx.forwardMessage(from , to)
          }
        }
        break
      default:
        break;
    }
    for (let index = 0; index < resultWorker.length; index++) {
      ctx.forwardMessage(resultWorker.from[index], )
      
    }
    // ctx.forwardMessage(-993081767, ctx.chat.id)
    // const chatMember = await ctx.chatMembers.getChatMember();

    // return ctx.reply(
    //     `Hello, ${chatMember.user.first_name}! I see you are a ${chatMember.status} of this chat!`,
    // );
})

// bot.on('message', async (ctx) => {
//   try {
//     console.log(ctx.message); // location
//   } catch (error) {
    
//   }
// })

bot.hears("/hi", async (ctx) => {
  try {
    console.log(ctx.message);
    await ctx.reply("Hello 👋");

    // console.log(ctx.from);
  } catch (error) {
    // console.error(error);
  }
});