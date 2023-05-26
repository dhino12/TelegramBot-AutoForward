/* eslint-disable prettier/prettier */
import { SaveStorage } from "../../utils/saveStorage";
import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";

const connectAsUser = async (idFromUser: number): Promise<TelegramClient> => {
    let session = "";

  const checkSession = SaveStorage.checkSession(idFromUser)[0];

  return new Promise((resolve, reject) => {
    if (checkSession == undefined) {
      return reject({
        code: 404,
        message:
          "Session is empty, please registerd \n /connect <phone_number>",
      });
    }
    console.log("idDetec: " + checkSession.session);

    if (checkSession) {
      session = checkSession.session;
    }

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
