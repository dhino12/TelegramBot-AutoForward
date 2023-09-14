# TelegramBot-AutoForward

> [Documentation in Indonesian](https://docs-v1.gitbook.io/autoforward-id/) 🇮🇩

You can use this BOT to gather messages from various Telegram chats (private/public channels, private/public groups, direct chats) and send them to one or multiple chat locations.<br>

Initially, the bot was made just for myself, but I am also very open if this bot is developed by more people and share views on this ✨, sorry due to the lack of free services to deploy I cannot share the bot's running telegram account, but I share how to deploy this bot into hosting until it runs<br>

⚠ Documentation is still a work in progress ⚠ <br>
📃 Documentation: [https://docs-v1.gitbook.io/autoforward-en](https://docs-v1.gitbook.io/autoforward-en)

## ❇ Here Are My Features ❇
- User-friendly Dashboard
- Forwards chats (public or private)
- Next Feature ? Ongoing 😁

## ⚙ Command List ⚙

| Menu      | Fitur             | Deskripsi                   |
| --------- | ----------------- | --------------------------- |
| ✅        | getuser           | GET ID - Name User  |
| ✅        | getgroup          | GET ID - Name Group |
| ✅        | getchannel        | GET ID - Name Channel |
| ✅        | forward           | Setup auto forward          |
| ✅        | connect           | Setup Account                  |

## Running on local
Clone this project with git, previously download git, and nodejs, search on google

> git clone https://github.com/dhino12/TelegramBot-AutoForward.git

### Install All Package
> npm i

### How to Used
Before using it, you can make a bot first with [botFather](https://t.me/botfather) read how to make it and get the Bot TOKEN [Telegram Bot](https://core.telegram.org/bots#how-do-i-create-a-bot) <br>
Because this bot is an auto forward, also register this app to telegram here [myTelegram](https://my.telegram.org/auth)
```
> Make sure you already have or put the Bot TOKEN and other feature API KEY in the environment (process.env.{name_env})
    > create a file .env
    > fill in the field with
        NODE_ENV=development
        BOT_TOKEN=<Token Bot>
        APPID=<APPID>
        APPHASH='<APPHASH>'
> If so, run the bot with npm run dev
> to convert all code into javascript you can use `npm run build`.
```
👉 Need detailed documentation? [Here's how to use this bot](https://docs-v1.gitbook.io/autoforward-en/running-app/how-to-run-this-bot-in-local) <br>

**Penggunaan Worker** <br>
https://medium.com/@Trott/using-worker-threads-in-node-js-80494136dbb6
<br><br>

**menu-button** <br>
https://core.telegram.org/bots/features#commands
<br><br>

## Video penggunaan

[![Tutorial](https://img.shields.io/badge/YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://youtu.be/eLiNNm7Nco0) <br>

how to run this bot on local server (personal computer) ?<br>
[![Tutorial](https://img.shields.io/badge/Youtube-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://youtu.be/wUE9niX0Isc)

## Contributing

Pull requests are welcome. If you have any suggestions, you can also create an [issue](https://github.com/neumanf/grammy-vercel-boilerplate/issues).

## License

[MIT](https://choosealicense.com/licenses/mit/)
