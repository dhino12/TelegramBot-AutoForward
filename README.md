# TelegramBot-AutoForward
AutoForward TelegramBot

Ketika Telegram bot dijadikan dalam 1 file yang sama seperti ini hal tersebut dapat dilakukan dan code valid
```javascript
const client = new TelegramClient(new StringSession(''), 20450718, 'd7484191ce14a0ab151857143e11701f', {
    connectionRetries: 5,
});


async function login (conversation, context) {
    try {
        console.log("Loading interactive example...");
        
        await client.connect()
    }catch() {}
}
```

Namun ketika TelegramClient dipisah hal tersebut meyebabkan invalid code, dikarenakan server berjalan ulang dan variable menjadi kosong