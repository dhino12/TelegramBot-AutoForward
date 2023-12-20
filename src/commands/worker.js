"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const telegram_1 = require("telegram");
const sessions_1 = require("telegram/sessions");
const events_1 = require("telegram/events");
const errors_1 = require("telegram/errors");
const connectAsUser = async (session) => { 
    return new Promise((resolve, reject) => {
        const client = new telegram_1.TelegramClient(new sessions_1.StringSession(session), parseInt(`${process.env.APPID}`), `${process.env.APPHASH}`, {
            connectionRetries: 5,
        });
        return resolve(client);
    });
};
const clientChat = async () => {
    const clientUser = await connectAsUser(process.env.SESSION_STRING);
    await clientUser.connect();
    console.log("auth: " + (await clientUser.checkAuthorization()));
    if (!(await clientUser.checkAuthorization()))
        return console.log("Client User unauthorized");
    const dataForwards = JSON.parse(process.env.dataForwards);
    // console.log(dataForwards);
    dataForwards.data.forEach((dataForward) => {
        clientUser.addEventHandler(async (event) => {
            var _a, _b;
            const message = event.message;
            console.log("clientHandler: ", new Date(), " <= ", message.senderId);
            if (message.chatId == undefined)
                return;
            if (message.chatId == undefined)
                return;
            if (((_a = event.message.chatId) === null || _a === void 0 ? void 0 : _a.toString()) != dataForward.id && !dataForward.from.includes((_b = message.chatId) === null || _b === void 0 ? void 0 : _b.toString())) {
                return;
            }
            console.log(event.isPrivate, " ", message.senderId);
            if (message.senderId == undefined)
                return console.log("senderID == undefined"); 
            const getMev2 = await clientUser.getEntity(message.senderId);
            console.log(message.senderId, " ", message.message);
            try {
                for (const toChat of dataForward.to) {
                    await message.forwardTo(toChat);
                }
            }
            catch (error) {
                console.log("throw: " + error);
                if (Number.isInteger(error.error_code) && process.send != undefined) {
                    process.send(error.error_code);
                }
                if (error instanceof errors_1.RPCError && process.send != undefined) {
                    for (const toChat of dataForward.to) {
                        // await message.forwardTo(toChat);
                        process.send(`toChat:${toChat};[➡ Forwarded from ${getMev2["firstName"]}](https://t.me/c/${Math.abs(parseInt(`${message.chatId}`))}/999999999): \n${message.message}`);
                    }
                }
                return;
            }
        }, new events_1.NewMessage({}));
    });
};
clientChat().catch(console.error);
