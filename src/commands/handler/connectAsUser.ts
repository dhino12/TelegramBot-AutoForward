/* eslint-disable prettier/prettier */
import { SaveStorage } from "../../utils/saveStorage";
import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";

const connectAsUser = async (idFromUser: number): Promise<TelegramClient> => {
  let session = "";

  const filePath = SaveStorage.checkSessionExist("session");
  const result = SaveStorage.loadSession(filePath);
  const IdDetected = result.filter(({ id }) => id == idFromUser)[0];

  return new Promise((resolve, reject) => {
    if (IdDetected == undefined) {
      return reject({
        code: 404,
        message:
          "Session is empty, please registerd \n /connect <phone_number>",
      });
    }

    if (IdDetected) {
      session = IdDetected.session;
    }
    console.log("idDetec: " + session);

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

const logoutAsUser = async(): Promise<TelegramClient> => {
  return new Promise((resolve, reject) => {
    const client = new TelegramClient(
      new StringSession(""),
      parseInt(`${process.env.APPID}`),
      `${process.env.APPHASH}`,
      {
        connectionRetries: 5,
      }
    );

    return resolve(client);
  })
}

export { connectAsUser, logoutAsUser };
