// const { TelegramClient } = require("telegram");
const { TelegramClient, Api } = require("telegram");
const { StringSession, StoreSession } = require("telegram/sessions");
const { bot } = require("../../server");
const { SaveStorage } = require("../utils/saveStorage");
const validator = require('validator')
const locales = require('../data/locale.json')
let client = undefined
// const api = require("./API");
// const input = require("input"); // npm i input
// const { StringSession } = require("telegram/sessions");

bot.callbackQuery("firstconnection", (context) => {
  bot.api.sendMessage(
    context.chat.id,
    `
    *\\Connect Help Menu*\\

    Use it to connect your account with Auto Forward Message Telegram Bot\\, You will need at least one connected account with Auto Forward Message Telegram Bot to use other commands
    
    Enter the phone number of the telegram account which is already a member of the desired source chats\\, along with country code
    
    *\\Command Arguments*\\
    \\/connect PHONE\\_NUMBER
    
    *\\For Example:*\\
    \\/connect \\+84444444444
    
    You can find every country prefix code by 
    
    Don't know how to start 🤔🤔🤔? 
    👉`,
    {
      parse_mode: "MarkdownV2",
    }
  );
});

bot.callbackQuery("documentation", (ctx) => {
  ctx.reply(`Untuk melihat dokumentasi silahkan ke [dokumentasi](google.com)`);
});

async function connectAsUser(idFromUser) {
  let session = "";

  const filePath = SaveStorage.checkSessionExist('session');
  const result = SaveStorage.loadSession(filePath);
  const IdDetected = result.filter(({ id }) => id == idFromUser)[0];

  if (IdDetected) {
    session = IdDetected.session;
  }
  console.log("idDetec: " + session);

  client = new TelegramClient(
    new StringSession(session),
    parseInt(process.env.APPID),
    process.env.APPHASH,
    {
      connectionRetries: 5,
    }
  );
  
  return { client }
}

async function sendCode(phoneNumber, locale) {
  const localeCountry = locales.filter((localeVal) => localeVal.startsWith(locale + "-"))[0]
  if (validator.default.isEmpty(phoneNumber) || !validator.default.isMobilePhone(`${phoneNumber.trim()}`, localeCountry)) {
    console.log("PhoneNumber has ", phoneNumber);
    throw {
      code: 404,
      message: "Ooops PhoneNumber is notValid, please follow /connect <phoneNumber>"
    };
  }

  const resultCodeHash = await client.sendCode(
    {
      apiHash: process.env.APPHASH,
      apiId: parseInt(process.env.APPID),
    },
    phoneNumber
  );
 
  return resultCodeHash;
}

async function signIn({phoneNumber, phoneCodeHash, code}) {
  /** contents of the codeAuth are
   * {
   *  phoneCodeHash,
   *  yourCodeFromTelegram,
   *  phoneNumber
   * }
   */
  try {
    if (code == null || code == undefined) {
      console.log("codeAuth has ", code);
      return;
    }
    console.log(code);
    await client.invoke(
      new Api.auth.SignIn({
        phoneNumber,
        phoneCodeHash,
        phoneCode: code.toString('utf-8'),
      })
    );
    return true
  } catch (error) {
    console.error(error);
    return false
  }
}

async function disconnect() {
    client.disconnect()
}

async function saveSession(userInfo, fileName) {
    return SaveStorage.set(userInfo, fileName);
}

module.exports = { connectAsUser, saveSession, sendCode, signIn, disconnect };
