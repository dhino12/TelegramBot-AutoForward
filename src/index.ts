import * as dotenv from "dotenv";
dotenv.config();

import commands from "./commands";
import { bot } from "./core/bot";
import { development, production } from "./utils/launch";
import { toMarkdownV2 } from "./utils/textManipulation";
import { getAllPidHandler, updatePidHandler } from "./libs/handler/pidHandler";

bot.use(commands);

process.env.NODE_ENV === "development" ? development(bot) : production(bot);

// Tangani penolakan promise di luar setTimeout
process.on('unhandledRejection', (reason:any, promise) => {
    console.error('Penolakan promise yang tidak ditangani:', reason);
    if (reason['code'] != undefined) return bot.api.sendMessage(reason['id'], toMarkdownV2(reason['message']), {
        parse_mode: 'MarkdownV2'
    })
});

// Anda juga dapat menambahkan penanganan SIGINT jika diperlukan
process.on("SIGINT", async () => {
    const pidDatas = await getAllPidHandler()
    console.log(`pid: ${[...Object.keys(pidDatas.data)]} killed`);
    for (const key in pidDatas.data) {
        const dataPidTmp = {}
        dataPidTmp[key] = {
            pid: 0,
        };
        await updatePidHandler(dataPidTmp)
    }
    console.log("Server Has Been Stoped... There is a problem, please check the hosting or server you are using.");
    process.exit(0); // Keluar dengan kode sukses (0)
});

export {};
