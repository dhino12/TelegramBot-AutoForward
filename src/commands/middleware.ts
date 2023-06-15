import { Api, TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";
import * as dotenv from "dotenv";
import connectAsUser from "./handler/connectAsUser";
import validator from "validator";
import { NewMessage } from "telegram/events";
import textHelp from "../utils/textHelp.json";
import { getUserDB, getchanelDB, getgroupDB } from "./handler/dialogs";
import { Context } from "grammy";
import Converstation from "./handler/converstation";
import getAllFromIdForwardHandler from "../libs/handler/getAllFromIdForwardHandler";
import registerHandler from "../libs/handler/registerHandler";
import loginHandler from "../libs/handler/loginHandler"
import updateUserHandler from "../libs/handler/updateUserHandler";
import deleteUserHandler from "../libs/handler/deleteUserHandler"; 
import { fork } from "child_process";
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
            const phoneCode = dataUser["mycode"].toLowerCase().replace("mycode", "").trim();
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
    if (context.from?.id == undefined || context.chat == undefined) return;

    const checkSession = await loginHandler(`${context.from.id}`)
    
    if (checkSession.data != undefined) {
        await startObserve(context);
        return checkSession;
    }

    await client.connect();
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

    setTimeout(async () => {
        try {
            if (!(await loginHandler(`${context.from?.id}`)).data) {
                await client.disconnect()
                // await startObserve(context)
                await context.reply("time has expired from the timeout of 60 seconds, please repeat the command /connect <PhoneNumber>")
            }
        } catch (error) {
            throw error
        }   
    }, 60000);
    return;
}

async function signIn(context: Context) {
    if (context.from?.id == undefined || context.chat == undefined) return;
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
    const result = await registerHandler({
        id: `${context.from.id}`,
        name: context.from.first_name,
        session: client.session.save(),
        dialogs: [],
        isBot: context.from.is_bot,
    })
    await client.disconnect()

    await startObserve(context);
    return result;
}

async function logout(context: Context) {
    try {
        if (context.from == undefined || context.message == undefined) {
            throw {
                code: 404,
                message: "Sorry getGroup is not completed!, empty id",
            };
        }
        
        const result = await deleteUserHandler(`${context.from.id}`);
        if (result.code == 204) {
            context.reply("Session Berhasil dihapus", {
                reply_to_message_id: context.message.message_id
            });
        } else {
            context.reply("Ooopss sepertinya anda belum login");
        }
    } catch (error) {
        console.error(error);
    }

    await client.disconnect()
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
        const { data } = await loginHandler(`${context.from.id}`);
        if (data == undefined) throw {
            code: 404, message: "data is empty, please login /connect phoneNumber"
        }
        client = await connectAsUser(data.session);
        await client.connect();
        const groupFromDB = getgroupDB(data);
        if (groupFromDB.length != 0 && context.match != "update") {
            // check in db
            await client.disconnect();
            return await context.reply(textHelp.textGetGroup + groupFromDB.toString().replaceAll(",", ""), {
                parse_mode: "Markdown",
            });
        }

        // create newDialogs in session.js
        const dialogs = await client.getDialogs();
        const groups: any[] = [];
        const dialogsData = dialogs.map((dialog) => {
            if (!dialog.isChannel && dialog.isGroup == true) {
                const data = {
                    id: `${dialog.id}`,
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
        // await SaveStorage.updateDialogs(context.from.id, "session", groups);
        const result = await updateUserHandler({
            ...data, id: data.id.toString()
        }, groups)
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
        const { data } = await loginHandler(`${context.from.id}`);
        if (data == undefined) throw {
            code: 404, message: "data is empty, please login /connect phoneNumber"
        }
        client = await connectAsUser(data.session);
        await client.connect();
        const channelDB = getchanelDB(data);
        if (channelDB.length != 0 && context.match != "update") {
            // check in db
            await client.disconnect();
            console.log("if channelDB");
            return await context.reply(textHelp.textGetChannel + channelDB.toString().replaceAll(",", ""), { parse_mode: "Markdown" });
        }

        // create newDialogs in session.js
        const channels: any[] = [];
        const dialogs = await client.getDialogs();
        const dialogsData = dialogs.map((dialog) => {
            if (dialog.isChannel) {
                channels.push({
                    id: `${dialog.id}`,
                    folderId: Math.abs(parseInt(`${dialog.id}`)),
                    title: dialog.title,
                    isGroup: dialog.isGroup,
                    isChannel: dialog.isChannel,
                });
                return `[${dialog.title}](https://t.me/c/${Math.abs(parseInt(`${dialog.entity?.id}`))}/999999999) => ${dialog.id}\n`;
            }
        });

        // save to storage
        const result = await updateUserHandler({
            ...data, id: data.id.toString()
        }, channels)
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
        const { data } = await loginHandler(`${context.from.id}`);
        if (data == undefined) throw {
            code: 404, message: "data is empty, please login /connect phoneNumber"
        }
        client = await connectAsUser(data.session);
        await client.connect();
        const userDB = getUserDB(data);
        if (userDB.length != 0 && context.match != "update") {
            // check in db
            return await context.reply(textHelp.textGetUser + userDB.toString().replaceAll(",", ""), { parse_mode: "Markdown" });
        }

        // create newDialogs in session.js
        const users: any[] = [];
        const dialogs = await client.getDialogs();
        const dialogsData = dialogs.map((dialog) => {
            if (dialog.isUser) {
                console.log(dialog);
                
                users.push({
                    id: `${dialog.id}`,
                    folderId: Math.abs(parseInt(`${dialog.id}`)),
                    title: dialog.title,
                    isGroup: dialog.isGroup,
                    isChannel: dialog.isChannel,
                });
                return `[${dialog.title}](https://t.me/c/${Math.abs(parseInt(`${dialog.entity?.id}`))}/999999999) => ${dialog.id}\n`;
            }
        });

        // save to storage
        const result = await updateUserHandler({
            ...data, id: data.id.toString()
        }, users)
        await context.reply(textHelp.textGetUser + dialogsData.toString().replaceAll(",", ""), { parse_mode: "Markdown" });
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
        client.session.close()
        const { data } = await loginHandler(`${context.from.id}`);
        if (data == undefined) throw {
            code: 404, message: "data is empty, please login /connect phoneNumber"
        } 
        const serverProcess = fork('src/commands/worker.ts', [], {
            env: {
                ...process.env,
                IDUser: data.id.toString(),
                SESSION_STRING: data.session
            }
        })

        serverProcess.on('message', (message) => {
            console.log(`Received message from server process ${serverProcess.pid}: `, message);
            if (message.toString().includes('kill')) {
                //   stopWorkerByPID(serverProcess.pid)
                console.log('Stop Worker: ' + serverProcess.pid);
            }
        });
        serverProcess.on('error', (error) => {
            console.error(`Error in server process ${serverProcess.pid}:`, error);
        });
        serverProcess.on('exit', (code) => {
            console.log(`Server process ${serverProcess.pid} exited with code ${code}`);
        });

        context.api.sendMessage(context.from?.id, "Okey i'm ready...");
        console.log("END function");
    } catch (error: any) {
        console.error("startObserve: ", error);
        if(error.code != undefined) {
            await context.reply(error.message)
        }
    }
    return
}

export { login, logout, getChannel, getUser, getGroup, startObserve, signIn };