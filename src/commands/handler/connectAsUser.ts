/* eslint-disable prettier/prettier */
import loginHandler from "../../libs/handler/loginHandler";
// import { SaveStorage } from "../../utils/saveStorage";
import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";
import { lookup } from "ps-node"

const checkWorker = async (pid: number) => {
  lookup({ pid }, (err, resultList) => {
    if (err) {
      console.error(err);
      return
    }

    const workerProcess = resultList[0]
    if (workerProcess) {
      console.log(`Worker process with PID ${workerProcess.pid} is running.`);
    } else {
      console.log(`Worker process with PID ${pid} is not running.`);
    }  
  })
}

const connectAsUser = async (session: string): Promise<TelegramClient> => {
  // let session = "";

  // const checkSession = await loginHandler(`${idFromUser}`);

  return new Promise((resolve, reject) => {
    const client = new TelegramClient(
      new StringSession(session),
      parseInt(`${process.env.APPID}`),
      `${process.env.APPHASH}`,
      {
        connectionRetries: 5,
      }
    );

    return resolve(client);
  });
};

export default connectAsUser;
