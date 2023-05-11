import { MyContext, MyConversation, bot } from "../core/bot";
import { Api, TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";
import * as dotenv from "dotenv";
import { SaveStorage } from "../utils/saveStorage";
import connectAsUser from "./handler/connectAsUser";
import validator from "validator";
import { loadWorkers } from "../utils/forwardWorker";
import { NewMessage } from "telegram/events";
import textHelp from "../utils/textHelp.json"
import { getUserDB, getchanelDB, getgroupDB } from "./handler/dialogs";
import { createConversation } from "@grammyjs/conversations";
dotenv.config();

let phoneCode = "";
let client = new TelegramClient(new StringSession(""), parseInt(`${process.env.APPID}`), `${process.env.APPHASH}`, {
    connectionRetries: 5,
});

async function askPhoneCode(conversation: MyConversation, context: MyContext) {
    try {
        await context.reply(
            "Silahkan masukan code user yang dikirim telegram dari SMS / chat app\n\nFor Example, your login code is 123456 dan masukan mycode123456",
        );
        const { message } = await conversation.wait();
        console.log("askPhoneCode: " + message?.text);
        if (!message?.text?.toString().toLowerCase().includes("mycode"))
            throw {
                code: 500,
                message: "please use **mycode<yourcode>** without space\n, please repeat the command /connect <phoneNumber>",
            };
        phoneCode = message.text.toLowerCase().replace("mycode", "").trim();
        // const authSignin = await signIn({...auth, code: phoneCode.toString('utf-8')})

        return phoneCode;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function login(conversation: MyConversation, context: MyContext) {
    try {
      const filePath = SaveStorage.checkSessionExist("session");
      const result = SaveStorage.loadSession(filePath);
      if (context.from == undefined) {
        throw {
            code: 404,
            message: "ERROR ID undefined"
        }
      }
      const IdDetected = result.filter(({ id }) => id == context.from?.id)[0];
      if (IdDetected != undefined) {
        await client.disconnect();
        client = await connectAsUser(context.from?.id);
      }
      console.log("Loading interactive example...");
      await client.connect();
  
      if (await client.isUserAuthorized()) {
        await context.reply("Anda Sudah Login 👌");
        await observeClientChat(context);
        return;
      }
  
      const phoneNumber = context.match;
      if (
        validator.isEmpty(`${phoneNumber}`) ||
        !validator.isMobilePhone(`${phoneNumber}`)
      ) {
        console.log("PhoneNumber has ", phoneNumber);
        throw {
          code: 404,
          message:
            "Ooops PhoneNumber is notValid,\nplease follow /connect <phoneNumber>",
        };
      }
      const auth = await client.sendCode(
        {
          apiHash: `${process.env.APPHASH}`,
          apiId: parseInt(`${process.env.APPID}`),
        },
        `${phoneNumber}`
      );
  
      const phoneCode = await askPhoneCode(conversation, context);
  
      await client.invoke(
        new Api.auth.SignIn({
          phoneNumber: `${phoneNumber}`,
          phoneCodeHash: auth.phoneCodeHash,
          phoneCode: phoneCode.toString(),
        })
      );
  
      console.log(client.session.save()); // Save this string to avoid logging in again
  
      SaveStorage.set(
        {
          id: context.from.id,
          name: context.from.first_name,
          session: client.session.save(),
          dialogs: [],
          isBot: context.from.is_bot,
        },
        "session"
      );
  
      await context.reply("Success !");
      await client.disconnect();
    } catch (error: any) { 

        if (Number.isInteger(error.code) || error.seconds == undefined) {
            await context.reply(error?.message || "something wen't wrong");
        }

        if (error.seconds) {
            await context.reply(
              `FLOOD: anda sudah mencapai batas, tunggu hingga ${error.seconds} detik`
            );
        }

        await client.disconnect();
        console.log(error);
    }
  
    return;
}

async function logout(conversation: MyConversation, context: MyContext) {
    try {
        if (context.from == undefined) {
            throw {
                code: 404,
                message: "Sorry getGroup is not completed!, empty id"
            }
          }
        const result = SaveStorage.rm(context.from.id, "session");
        client.invoke(new Api.auth.LogOut());
        if (result) {
            context.reply("Session Berhasil dihapus");
        } else {
            context.reply("Ooopss sepertinya anda belum login");
        }
    } catch (error) {
        console.error(error);
    }
  
    return;
}
  
async function getGroup(conversation: MyConversation, context: MyContext) {
    try {
      await client.disconnect();
      if (context.from == undefined) {
        throw {
            code: 404,
            message: "Sorry getGroup is not completed!, empty id"
        }
      }
      client = await connectAsUser(context.from.id);
      await client.connect();
  
      const groupFromDB = getgroupDB(context.from.id);
      if (groupFromDB.length != 0 && context.match != "update") {
        // check in db
        await client.disconnect();
        return await context.reply(
          textHelp.textGetGroup + groupFromDB.toString().replaceAll(",", ""),
          {
            parse_mode: "Markdown",
          }
        );
      }
  
      // create newDialogs in session.js
      const dialogs = await client.getDialogs();
      const groups: object[] = [];
      const dialogsData = dialogs.map((dialog) => {
        if (!dialog.isChannel && dialog.isGroup == true) {
            const data = {
                id: dialog.id,
                folderId: Math.abs(parseInt(`${dialog.id}`)),
                title: dialog.title,
                isGroup: dialog.isGroup,
                isChannel: dialog.isChannel,
            }
          groups.push(data);
  
          return `[${dialog.title}](https://t.me/c/${Math.abs(
            parseInt(`${dialog.id}`)
          )}/999999999) => ${dialog.id}\n`;
        }
      });
  
      // save to storage
      await SaveStorage.updateDialogs(context.from.id, "session", groups);
      await context.reply(
        textHelp.textGetGroup + dialogsData.toString().replaceAll(",", ""),
        { parse_mode: "Markdown" }
      );
    } catch (error: any) {
      if (error.code) {
        context.reply(error.message);
      }
      console.log(error);
    }
    await client.disconnect();
    return;
}  

async function getChannel(conversation: MyConversation, context: MyContext) {
    try {
      await client.disconnect();
      if (context.from == undefined) {
        throw {
            code: 404,
            message: "Sorry getGroup is not completed!, empty id"
        }
      }
      client = await connectAsUser(context.from.id);
      await client.connect();
  
      const channelDB = getchanelDB(context.from.id);
      if (channelDB.length != 0 && context.match != "update") {
        // check in db
        await client.disconnect();
        console.log("if channelDB");
        return await context.reply(
          textHelp.textGetChannel + channelDB.toString().replaceAll(",", ""),
          { parse_mode: "Markdown" }
        );
      }
  
      // create newDialogs in session.js
      const channels: object[] = [];
      const dialogs = await client.getDialogs();
      const dialogsData = dialogs.map((dialog) => {
        if (dialog.isChannel) {
          channels.push({
            id: dialog.id,
            folderId: Math.abs(parseInt(`${dialog.id}`)),
            title: dialog.title,
            isGroup: dialog.isGroup,
            isChannel: dialog.isChannel,
          });
          return `[${dialog.title}](https://t.me/c/${Math.abs(
            parseInt(`${dialog.id}`),
          )}/999999999) => ${dialog.id}`;
        }
      });
  
      // save to storage
      await SaveStorage.updateDialogs(context.from.id, "session", channels);
      await context.reply(
        textHelp.textGetChannel + dialogsData.toString().replaceAll(",", ""),
        { parse_mode: "Markdown" }
      );
    } catch (error: any) {
      if (error.code) {
        context.reply(error.message);
      }
      console.error(error);
    }
    await client.disconnect();
    return;
}

async function getUser(conversation: MyConversation, context: MyContext) {
    try {
      await client.disconnect();
      if (context.from == undefined) {
        throw {
            code: 404,
            message: "Sorry getGroup is not completed!, empty id"
        }
      }
      client = await connectAsUser(context.from.id);
      await client.connect();
  
      const userDB = getUserDB(context.from.id);
      if (userDB.length != 0 && context.match != "update") {
        // check in db
        // await client.disconnect()
        console.log("if userDB");
        return await context.reply(
          textHelp.textGetChannel + userDB.toString().replaceAll(",", ""),
          { parse_mode: "Markdown" }
        );
      }
  
      // create newDialogs in session.js
      const users: object[] = [];
      const dialogs = await client.getDialogs();
      const dialogsData = dialogs.map((dialog) => {
        if (dialog.isChannel == false && dialog.isGroup == false) {
          users.push({
            id: dialog.id,
            folderId: Math.abs(parseInt(`${dialog.id}`)),
            title: dialog.title,
            isGroup: dialog.isGroup,
            isChannel: dialog.isChannel,
          });
          return `[${dialog.title}](https://t.me/c/${Math.abs(
            parseInt(`${dialog.id}`)
          )}/999999999) => ${dialog.id}\n`;
        }
      });
  
      // save to storage
      await SaveStorage.updateDialogs(context.from.id, "session", users);
      await context.reply(
        textHelp.textGetChannel + dialogsData.toString().replaceAll(",", ""),
        { parse_mode: "Markdown" }
      );
    } catch (error: any) {
      if (error.code) {
        context.reply(error.message);
      }
      console.error(error);
    }
    // await client.disconnect()
    return;
}

async function observeClientChat(context: MyContext) {
    if (context.from == undefined) {
        return
    }

    const resultWorker = loadWorkers(context.from.id)[0];
    if (resultWorker == undefined) return;

    for (const from of resultWorker.from) {
        for (const to of resultWorker.to) {
            console.log("masuk for dalam");
            //   await ctx.forwardMessage(to , from)
            client.addEventHandler(async (event) => {
                const message = event.message;
    
                if (event.isPrivate && message.senderId != undefined) {
                const getMev2 = await client.getEntity(message.senderId);
                console.log(message.senderId);
                console.log(message.message);
                console.log(message.fromId);
                console.log(message.id);
                console.log(message.sender);
                console.log(getMev2);
    
                try {
                    await context.api.sendMessage(
                        to,
                        `
                                From: ${getMev2["firstName"]} \n-----\n${message.message}`
                    );
                } catch (error: any) {
                    console.log(error);
                    
                    if (Number.isInteger(error.error_code)) {
                        await context.reply(`sepertinya bot belum tergabung didalam [group/channel](https://t.me/c/${Math.abs(to)}/999999999)`, {
                            parse_mode: "Markdown",
                        });
                    }
                }
                // await context.forwardMessage(2026146290 , Number(message.senderId))
                //  await bot.api.forwardMessage(2026146290, message.senderId, message.chatId)
                }
            }, new NewMessage({ fromUsers: from }));
        }
    }
}  

// bot.use(createConversation(login))
// bot.use(createConversation(logout))
// bot.use(createConversation(getchannel))
// bot.use(createConversation(getgroup))
// bot.use(createConversation(getuser))

export {
    login,
    logout,
    getChannel,
    getUser,
    getGroup,
    observeClientChat
}