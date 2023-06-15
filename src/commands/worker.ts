import connectAsUser from "./handler/connectAsUser";
import { NewMessage } from "telegram/events";
import { RPCError } from "telegram/errors";
import getAllForwardByIdHandler from "../libs/handler/getAllForwardByIdHandler";

const clientChat = async (): Promise<void> => {
    const clientUser = await connectAsUser(process.env.SESSION_STRING as string);
    await clientUser.connect();

    console.log("auth: " + await clientUser.isUserAuthorized());
    if (!(await clientUser.isUserAuthorized())) return console.log('Client User unauthorized');
    const dataForwards = await getAllForwardByIdHandler(process.env.IDUser as string)
    console.log(dataForwards);
    console.log(process.env.IDUser);
    

    dataForwards.data.forEach(dataForward => {
        clientUser.addEventHandler(async (event) => {
            const message = event.message;
            console.log('clientHandler: ', new Date(), " <= ", message.senderId); 
            if (message.chatId == undefined) return
            if (message.chatId == undefined) return;    
            if (event.message.chatId?.toString() != dataForward.id && !dataForward.from.includes(message.chatId?.toString() as never)) {
                return;
            }
            if (!event.isPrivate || message.senderId == undefined) return console.log('Bukan Obrolan Private / senderID == undefined');

            // penyebab kenapa bot tidak mendeteksi pesan group
            // rencananya adalah ketika group ada pesan maka forward ke user
            // group => user
            // console.log(context.message?.contact);  
            const getMev2 = await clientUser.getEntity(message.senderId);
            console.log(message.senderId, " ", message.message);
            try { 
                for (const toChat of dataForward.to) {
                    await message.forwardTo(toChat)
                };
            } catch (error: any) {
                console.log("throw: "+error);

                if (Number.isInteger(error.error_code) && process.send != undefined) {
                    process.send(error.error_code)
                }

                if (error instanceof RPCError && process.send != undefined) {
                    for (const toChat of dataForward.to) {
                        process.send(`toChat:${toChat};From: ${getMev2["firstName"]} (notHere) \n-----\n${message.message}`)
                    }
                }
                console.log(error);
                return;
            }
        }, new NewMessage({fromUsers: dataForward.from}));
    })
};

clientChat().catch(console.error);