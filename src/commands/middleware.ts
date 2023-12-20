import { Api, TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";
import * as dotenv from "dotenv";
import { Context } from "grammy";
import { ChildProcess, fork } from "child_process";
import connectAsUser from "./handler/connectAsUser";
import validator from "validator";
import textHelp from "../utils/textHelp.json";
import { getUserDB, getchanelDB, getgroupDB } from "./handler/dialogs";
import Converstation from "./handler/converstation";
import registerHandler from "../libs/handler/registerHandler";
import updateUserHandler from "../libs/handler/updateUserHandler";
import deleteUserHandler from "../libs/handler/deleteUserHandler";
import getAllUserHandler from "../libs/handler/getAllUserHandler";
import loginHandler from "../libs/handler/loginHandler";
import { addPidHandler, getPidByIdHandler, updatePidHandler } from "../libs/handler/pidHandler";
import { getAllForwardByIdHandler } from "../libs/handler/getAllForwardByIdHandler";
import getAllForwardsHandler from "../libs/handler/getAllForwardsHandler";
dotenv.config();

let client = new TelegramClient(new StringSession(""), parseInt(`${process.env.APPID}`), `${process.env.APPHASH}`, {
    connectionRetries: 5,
});

let authentication = {
    phoneCodeHash: "",
    phoneNumber: "",
    isCodeViaApp: false,
};

async function askPhoneCode(context: Context): Promise<string> {
    try {
        if (context.from?.id == undefined || context.chat == undefined) return "";
        const converstation = new Converstation(context);
        const dataUser = await converstation.start();
        if (dataUser != undefined) {
            const phoneCode = dataUser["mycode"].toLowerCase().replace("mycode", "").trim();
            await converstation.end();
            return phoneCode;
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
    return "";
}

async function askPassword(context: Context): Promise<string> {
    try {
        if (context.from?.id == undefined || context.chat == undefined) return "";
        const converstation = new Converstation(context);
        const dataUser = await converstation.start();
        if (dataUser != undefined) {
            console.log(dataUser);

            const password2FA = dataUser["mycode"].toLowerCase().replace("mypass:", "").trim();
            await converstation.end();
            return password2FA;
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
    return "";
}

async function login(context: Context) {
    if (context.from?.id == undefined || context.chat == undefined) return;

    const checkSession = await loginHandler(`${context.from.id}`);

    if (checkSession.data != undefined) {
        await startTaskById(context);
        return checkSession;
    }

    await client.connect();
    const phoneNumber = context.match;
    if (validator.isEmpty(`${phoneNumber}`) || !validator.isMobilePhone(`${phoneNumber}`)) {
        console.log("PhoneNumber has ", phoneNumber);
        throw {
            code: 404,
            message: textHelp.phoneNumberInvalid,
        };
    }
    const auth = await client.sendCode(
        {
            apiHash: `${process.env.APPHASH}`,
            apiId: parseInt(`${process.env.APPID}`),
        },
        `${phoneNumber}`,
    );
    if (phoneNumber == undefined) return;

    const dataAuth = {
        phoneNumber: phoneNumber.toString(),
        phoneCodeHash: auth.phoneCodeHash,
        isCodeViaApp: auth.isCodeViaApp,
    };

    authentication = dataAuth;

    setTimeout(async () => {
        if (!(await loginHandler(`${context.from?.id}`)).data) {
            await client.disconnect();
            throw {
                code: 401,
                message: textHelp.timeout,
                id: context.from?.id
            }
        }
    }, 60000);
    return;
}

async function signIn(context: Context) {
    if (context.from?.id == undefined || context.chat == undefined) return;
    const phoneCode = await askPhoneCode(context);

    if (phoneCode == "") {
        console.log("phoneCode : ", phoneCode);
        return;
    }
    
    setTimeout(async () => {
        if (!(await loginHandler(`${context.from?.id}`)).data) {
            await client.disconnect();
            throw {
                code: 401,
                message: textHelp.timeOut2FA,
                id: context.from?.id
            }
        }
    }, 60000);
    console.log("====== authentication SIGNIN ========== ");
    console.log("Authentication Successful");
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
    });
    await client.disconnect();

    await startTaskById(context);
    return result;
}

async function twoFactorAuthentication(context: Context) {
    if (context.from?.id == undefined || context.chat == undefined) return;

    const password = await askPassword(context);
    if (password == "") {
        console.error("Password 2FA: NULL");
        return;
    }
    await client.signInWithPassword(
        {
            apiId: parseInt(`${process.env.APPID}`),
            apiHash: `${process.env.APPHASH}`,
        },
        {
            password: async (hint) => {
                return password;
            },
            onError: function (err: Error): void | Promise<boolean> {
                console.log("==== 2FA Error ====");
                console.log(err);

                throw new Error("Please run /connect <phone_number>.");
            },
        },
    );

    const result = await registerHandler({
        id: `${context.from.id}`,
        name: context.from.first_name,
        session: client.session.save(),
        dialogs: [],
        isBot: context.from.is_bot,
    });
    await client.disconnect();

    await startTaskById(context);
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
                reply_to_message_id: context.message.message_id,
            });
        } else {
            context.reply("Ooopss sepertinya anda belum login");
        }
    } catch (error) {
        console.error(error);
    }

    await client.disconnect();
    return;
}

async function getGroup(context: Context) {
    if (context.from == undefined) {
        throw {
            code: 404,
            message: "Sorry getGroup is not completed!, empty id",
        };
    }
    const { data } = await loginHandler(`${context.from.id}`);
    if (data == undefined)
        throw {
            code: 404,
            message: textHelp.unauthorizedDataIsEmpty,
        };
    await client.disconnect();
    client = await connectAsUser(data.session);
    await client.connect();
    // create newDialogs in session.js
    const dialogs = await client.getDialogs();
    const dialogsData = dialogs.map((dialog) => {
        if (!dialog.isChannel && dialog.isGroup == true) {
            return `[${dialog.title}](https://t.me/c/${Math.abs(parseInt(`${dialog.entity?.id}`))}/999999999) => ${dialog.id}\n`;
        }
    });
    await context.reply(textHelp.textGetGroup + dialogsData.toString().replaceAll(",", ""), { parse_mode: "Markdown" });
    await client.disconnect();
    return;
}

async function getChannel(context: Context) {
    if (context.from == undefined) {
        throw {
            code: 404,
            message: "Sorry getGroup is not completed!, empty id",
        };
    }
    const { data } = await loginHandler(`${context.from.id}`);
    if (data == undefined)
        throw {
            code: 404,
            message: textHelp.unauthorizedDataIsEmpty,
        };
    await client.disconnect();
    client = await connectAsUser(data.session);
    await client.connect();

    // create newDialogs in session.js
    const dialogs = await client.getDialogs();
    const dialogsData = dialogs.map((dialog) => {
        if (dialog.isChannel) {
            return `[${dialog.title}](https://t.me/c/${Math.abs(parseInt(`${dialog.entity?.id}`))}/999999999) => ${dialog.id}\n`;
        }
    });
    await context.reply(textHelp.textGetChannel + dialogsData.toString().replaceAll(",", ""), { parse_mode: "Markdown" });
    await client.disconnect();
    return;
}

async function getUser(context: Context) {
    if (context.from == undefined) {
        throw {
            code: 404,
            message: "Sorry getGroup is not completed!, empty id",
        };
    }
    const { data } = await loginHandler(`${context.from.id}`);
    if (data == undefined)
        throw {
            code: 404,
            message: textHelp.unauthorizedDataIsEmpty,
        };
    await client.disconnect();
    client = await connectAsUser(data.session);
    await client.connect();

    // create newDialogs in session.js
    const dialogs = await client.getDialogs();
    const dialogsData = dialogs.map((dialog) => {
        if (dialog.isUser) {
            console.log(dialog);
            return `[${dialog.title}](https://t.me/${dialog.entity?.["username"]}) => ${dialog.id}\n`;
        }
    });

    await context.reply(textHelp.textGetUser + dialogsData.toString().replaceAll(",", ""), { parse_mode: "Markdown" });
    await client.disconnect();
    return;
}

// Menghentikan worker berdasarkan PID
function stopWorkerByPID(pid: number | undefined): boolean {
    if (pid == undefined) return false
    if (pid == 0) pid = Math.random() // avoid fatal error due to pid 0
    
    try {
        console.log('Worker: ', pid);
        const resultKill = process.kill(pid, 'SIGTERM')
        if (!resultKill) throw Error("TypeError [ERR_INVALID_ARG_TYPE]: The 'pid' argument must be of type number. Received type number")
        console.log('Worker kill: ', pid);
        return true
    } catch (error: any) {
        console.error("==== StopWorkerByPID");
        if (error.code == 'ESRCH') {
            console.error('PID Not Found');
            return false
        }
        console.log(error);
    }
    return false
}

async function startTaskById(context: Context) {
    if (context.from == undefined) return;
    try {
        client.session.close();
        const { data } = await loginHandler(`${context.from.id}`);
        if (data == undefined)
            throw {
                code: 404,
                message: textHelp.unauthorizedDataIsEmpty,
            };
        const dataAllForwardById = await getAllForwardByIdHandler(data.id.toString());
        await startObserve(context, {
            session: data.session,
            ...dataAllForwardById,
        });
    } catch (error: any) {
        console.error(error);
        throw {
            code: 404,
            message: `❌ Ooopss something wen't wrong when startTaskId:\n${error.message}`,
        };
    }
}

async function startAllTask(context: Context) {
    try {
        if (context.from == undefined) return;
        const datas = await getAllUserHandler();
        const dataForwards = await getAllForwardsHandler();
        const datasForwardsAndSession: any[] = [];
        datas.data.forEach((document) => {
            dataForwards.data.forEach((forward) => {
                if (document.id == forward.id) {
                    datasForwardsAndSession.push({
                        session: document.session,
                        data: dataForwards.data,
                    });
                }
            });
        });

        datasForwardsAndSession.forEach(async (data) => {
            await startObserve(context, data);
        });
    } catch (error) {
        console.error(error);
    }
}

async function startObserve(context: Context, dataForward: object) {
    if (context.from == undefined) return;

    try {
        client.session.close();
        const dataPidTmp = {};
        console.log(dataForward["name"]);

        const serverProcess = fork("src/commands/worker.js", [], {
            env: {
                ...process.env,
                SESSION_STRING: dataForward["session"],
                dataForwards: JSON.stringify(dataForward),
            },
        });

        // ====== Save & Update PID in DB
        const getPidById = await getPidByIdHandler(context.from.id);
        dataPidTmp[context.from.id] = {
            pid: serverProcess.pid,
        };
        // STOP OLD WORKER
        await stopWorkerByPID(getPidById.data.pid);
        console.log(dataForward["name"]);

        if (getPidById.code == 404) {
            await addPidHandler(dataPidTmp);
        } else {
            await updatePidHandler(dataPidTmp);
        }
        // ====== End

        serverProcess.on("message", (message) => {
            console.log(`Received message from server process ${serverProcess.pid}: `, message);
            if (message.toString().includes("/kill")) {
                stopWorkerByPID(serverProcess.pid);
                if (context.from == undefined) return;
                context.api.sendMessage(context.from?.id, "The task has stopped\n");
            }
            const match = message.toString().match(/toChat:(-?\d+);/);
            if (context.from == undefined || match == null) return;

            context.api.sendMessage(match[1], message.toString().replace(/toChat:-\d+;/, ''), {parse_mode: 'Markdown'});
        });
        serverProcess.on("error", (error) => {
            console.error(`Error in server process ${serverProcess.pid}:`, error);
        });
        serverProcess.on("exit", (code) => {
            console.log(`Server process ${serverProcess.pid} exited with code ${code}`);
        });

        context.api.sendMessage(context.from?.id, textHelp.botIsReady);
        console.log("END function");
    } catch (error: any) {
        console.error("startObserve: ", error);
        if (error.code != undefined) {
            await context.reply(error.message);
        }
    }
    return;
}

// Anda juga dapat menambahkan penanganan SIGINT jika diperlukan
// process.on("SIGINT", async () => {
//     console.log("Menerima sinyal SIGINT. Melakukan tindakan sebelum berhenti...");

//     process.exit(0); // Keluar dengan kode sukses (0)
// });
export { login, logout, getChannel, getUser, getGroup, startTaskById, startAllTask, signIn, twoFactorAuthentication };
