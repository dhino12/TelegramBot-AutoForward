import { MyContext, MyConversation } from "../core/bot";
import { Api, TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";
import * as dotenv from "dotenv";
import { SaveStorage } from "../utils/saveStorage";
import connectAsUser from "./handler/connectAsUser";
import validator from "validator";
import { loadWorkers } from "../utils/forwardWorker";
import { NewMessage } from "telegram/events";
import textHelp from "../utils/textHelp.json";
import { getUserDB, getchanelDB, getgroupDB } from "./handler/dialogs";
import { Context } from "grammy";
import Converstation from "./handler/converstation";
dotenv.config();

let client = new TelegramClient(new StringSession(""), parseInt(`${process.env.APPID}`), `${process.env.APPHASH}`, {
    connectionRetries: 5,
});
let authentication = {
    phoneCodeHash: "",
    phoneNumber: "",
    isCodeViaApp: false
}

async function askPhoneCode(context: Context): Promise<string> {
    try {
        if (context.from?.id == undefined || context.chat == undefined) return "";
        const converstation = new Converstation(context)
        const dataUser = await converstation.start()
        if (dataUser != undefined) {
            console.log(dataUser);
            const phoneCode = dataUser["mycode"].replace("mycode", "").trim();
            await converstation.end()
            return phoneCode;
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
    return ""
}

async function login(context: Context) {
    try {
        if (context.from?.id == undefined || context.chat == undefined) return;
        await client.connect();

        const checkSession = SaveStorage.checkSession(context.from?.id)[0];
        if (checkSession != undefined) {
            await context.reply("Anda Sudah Terdaftar 👌");
            await startObserve(context);
            return;
        }

        const phoneNumber = context.match;
        if (validator.isEmpty(`${phoneNumber}`) || !validator.isMobilePhone(`${phoneNumber}`)) {
            console.log("PhoneNumber has ", phoneNumber);
            throw {
                code: 404,
                message: "Ooops PhoneNumber is notValid,\nplease follow /connect <phoneNumber>",
            };
        }
        const auth = await client.sendCode(
            {
                apiHash: `${process.env.APPHASH}`,
                apiId: parseInt(`${process.env.APPID}`),
            },
            `${phoneNumber}`,
        );
        if (phoneNumber == undefined) return

        const dataAuth = {
            phoneNumber: phoneNumber.toString(),
            phoneCodeHash: auth.phoneCodeHash,
            isCodeViaApp: auth.isCodeViaApp,
        }
        
        authentication = dataAuth
        await context.reply(
            "Silahkan masukan code user yang dikirim telegram dari SMS / chat app\n\nFor Example, your login code is 123456 dan masukan mycode123456",
        );

        setTimeout(async () => {
            try {
                // jika dalam waktu 10 detik belum auth, maka disconnect
                    // dan jalankan kembali server
                if (!await client.isUserAuthorized()) {
                    await client.disconnect()
                    await startObserve(context)
                    await context.reply("time has expired from the timeout of 60 seconds, please repeat the command /connect <PhoneNumber>")

                    throw {
                        code: 500,
                        message: "waktu kamu sudah habis"
                    }
                }   
            } catch (error) {
                console.error(error);
                return;
            }
        }, 60000);
    } catch (error: any) {
        if (Number.isInteger(error.code) || error.seconds == undefined) {
            await context.reply(error?.message || "something wen't wrong");
        }

        if (error.seconds) {
            await context.reply(`FLOOD: anda sudah mencapai batas, tunggu hingga ${error.seconds} detik`);
        }
        console.log(error);
        await client.disconnect();
    }
    return;
}

async function signIn(context: Context) {
    if (context.from?.id == undefined || context.chat == undefined) return;
    try {
        const phoneCode = await askPhoneCode(context);

        if (phoneCode == "") {
            console.log("phoneCode : ", phoneCode);
            return
        }
        await client.invoke(
            new Api.auth.SignIn({
                phoneNumber: `${authentication["phoneNumber"]}`,
                phoneCodeHash: authentication.phoneCodeHash,
                phoneCode: phoneCode.toString(),
            }),
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
                "session",
        );
        await client.disconnect()
        await context.reply("Success !");

        await startObserve(context);
    } catch (error) {
        console.error(error); 
    }
}

async function logout(conversation: MyConversation, context: MyContext) {
    try {
        if (context.from == undefined) {
            throw {
                code: 404,
                message: "Sorry getGroup is not completed!, empty id",
            };
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

async function getGroup(context: Context) {
    try {
        await client.disconnect();
        if (context.from == undefined) {
            throw {
                code: 404,
                message: "Sorry getGroup is not completed!, empty id",
            };
        }
        client = await connectAsUser(context.from.id);
        await client.connect();

        const groupFromDB = getgroupDB(context.from.id);
        if (groupFromDB.length != 0 && context.match != "update") {
            // check in db
            await client.disconnect();
            return await context.reply(textHelp.textGetGroup + groupFromDB.toString().replaceAll(",", ""), {
                parse_mode: "Markdown",
            });
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
                };
                groups.push(data);

                return `[${dialog.title}](https://t.me/c/${Math.abs(parseInt(`${dialog.entity?.id}`))}/999999999) => ${dialog.id}\n`;
            }
        });

        // save to storage
        await SaveStorage.updateDialogs(context.from.id, "session", groups);
        await context.reply(textHelp.textGetGroup + dialogsData.toString().replaceAll(",", ""), { parse_mode: "Markdown" });
    } catch (error: any) {
        if (error.code) {
            context.reply(error.message);
        }
        console.log(error);
    }
    await client.disconnect();
    await startObserve(context);
    return;
}

async function getChannel(context: Context) {
    try {
        await client.disconnect();
        if (context.from == undefined) {
            throw {
                code: 404,
                message: "Sorry getGroup is not completed!, empty id",
            };
        }
        client = await connectAsUser(context.from.id);
        await client.connect();

        const channelDB = getchanelDB(context.from.id);
        if (channelDB.length != 0 && context.match != "update") {
            // check in db
            await client.disconnect();
            console.log("if channelDB");
            return await context.reply(textHelp.textGetChannel + channelDB.toString().replaceAll(",", ""), { parse_mode: "Markdown" });
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
                return `[${dialog.title}](https://t.me/c/${Math.abs(parseInt(`${dialog.entity?.id}`))}/999999999) => ${dialog.id}\n`;
            }
        });

        // save to storage
        await SaveStorage.updateDialogs(context.from.id, "session", channels);
        await context.reply(textHelp.textGetChannel + dialogsData.toString().replaceAll(",", ""), { parse_mode: "Markdown" });
    } catch (error: any) {
        if (error.code) {
            context.reply(error.message);
        }
        console.error(error);
    }
    await client.disconnect();
    await startObserve(context);
    return;
}

async function getUser(context: Context) {
    try {
        await client.disconnect();
        if (context.from == undefined) {
            throw {
                code: 404,
                message: "Sorry getGroup is not completed!, empty id",
            };
        }
        client = await connectAsUser(context.from.id);
        await client.connect();

        const userDB = getUserDB(context.from.id);
        if (userDB.length != 0 && context.match != "update") {
            // check in db
            return await context.reply(textHelp.textGetChannel + userDB.toString().replaceAll(",", ""), { parse_mode: "Markdown" });
        }

        // create newDialogs in session.js
        const users: object[] = [];
        const dialogs = await client.getDialogs();
        const dialogsData = dialogs.map((dialog) => {
            if (dialog.isUser) {
                console.log(dialog);
                
                users.push({
                    id: dialog.id,
                    folderId: Math.abs(parseInt(`${dialog.id}`)),
                    title: dialog.title,
                    isGroup: dialog.isGroup,
                    isChannel: dialog.isChannel,
                });
                return `[${dialog.title}](https://t.me/c/${Math.abs(parseInt(`${dialog.entity?.id}`))}/999999999) => ${dialog.id}\n`;
            }
        });

        // save to storage
        await SaveStorage.updateDialogs(context.from.id, "session", users);
        await context.reply(textHelp.textGetChannel + dialogsData.toString().replaceAll(",", ""), { parse_mode: "Markdown" });
    } catch (error: any) {
        if (error.code) {
            context.reply(error.message);
        }
        console.error(error);
    }
    await client.disconnect();
    await startObserve(context);
    return;
}

async function startObserve(context: Context) {
    if (context.from == undefined) return;

    try {
        await client.disconnect();
        client = await connectAsUser(context.from?.id);
        await client.connect();

        if (!(await client.isUserAuthorized())) return;
        const resultWorker = loadWorkers();
        if (resultWorker == undefined) {
            console.log("resultWorker undefined");

            return;
        }
        console.log(resultWorker);

        context.api.sendMessage(context.from?.id, "Wait 5s for next message");
        for (let index = 0; index < resultWorker.length; index++) {
            await clientChat(context, resultWorker[index]);
            console.log("END for");
        }

        context.api.sendMessage(context.from?.id, "Okey i'm ready...");
        console.log("END function");
    } catch (error: any) {
        console.error("startObserve: ", error);
        if(error.code != undefined) {
            await context.reply(error.message)
        }
    }
}

const clientChat = (context: Context, { to, from, id }): Promise<void> => {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, 1000);

        client.addEventHandler(async (event) => {
            const message = event.message;

            console.log(from.includes(event.message.chatId?.toString()));

            if (event.message.chatId?.toString() != id && !from.includes(event.message.chatId?.toString())) {
                console.log("masuk IF: ", await event.chatId, "  ", id);
                return;
            }
            // penyebab kenapa bot tidak mendeteksi pesan group
            // rencananya adalah ketika group ada pesan maka forward ke user
            // group => user
            if (event.isPrivate && message.senderId != undefined) {
                const getMev2 = await client.getEntity(message.senderId);
                console.log(message.senderId, " ", message.message);
                try {
                    for (const toChat of to) {
                        await context.api.sendMessage(
                            toChat,
                            `
                      From: ${getMev2["firstName"]} \n-----\n${message.message}`,
                        );
                    }
                    resolve();
                } catch (error: any) {
                    console.log(error);

                    if (Number.isInteger(error.error_code)) {
                        await context.reply(`sepertinya bot belum tergabung didalam [group/channel](https://t.me/c/${Math.abs(to)}/999999999)`, {
                            parse_mode: "Markdown",
                        });
                    }
                    return reject();
                }
            }
        }, new NewMessage({ fromUsers: from }));
    });
};

export { login, logout, getChannel, getUser, getGroup, startObserve, signIn };
