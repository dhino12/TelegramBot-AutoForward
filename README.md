# TelegramBot-AutoForward
AutoForward TelegramBot
**Idul Fitri Holiday**

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

Namun ketika TelegramClient dipisah hal tersebut meyebabkan invalid code, dikarenakan server berjalan ulang dan variable menjadi kosong<br><br>

## Clone Project ini
> git clone https://github.com/dhino12/TelegramBot-AutoForward.git

## Install Semua Package
> npm i

### Cara menggunakan
Sebelum menggunakannya kamu bisa membuat bot terlebih dahulu dengan [botFather](https://t.me/botfather) baca cara pembuatannya dan dapatkan TOKEN Bot nya [Telegram Bot](https://core.telegram.org/bots#how-do-i-create-a-bot) <br>
Dikarenakan bot ini adalah auto forward maka daftarkan juga apps ini ke telegram ke sini [myTelegram](https://my.telegram.org/auth)
```
> Pastikan Kamu Sudah Mempunyai Atau Menaruh TOKEN Bot Dan API KEY Fitur Lainnya Di Environment (process.env.{nama_env})
    > buat file dengan .env
    > isikan didalamnya dengan
        TOKEN=<Token Bot>
        APPID=<APPID>
        APPHASH='<APPHASH>'
> Jika sudah, jalankan bot dengan npm run dev
```

## Fitur

| Menu      | Fitur             | Deskripsi                   |
| --------- | ----------------- | --------------------------- |
| ✅        | getuser           | Mendapatkan ID - Nama User  |
| ✅        | getgroup          | Mendapatkan ID - Nama Group |
| ✅        | getchannel        | Mendapatkan ID - Nama Channel |
| ✅        | forward           | Setup auto forward          |
| ✅        | connect           | Setup akun                  |

**Penggunaan Worker**
https://medium.com/@Trott/using-worker-threads-in-node-js-80494136dbb6
<br><br>

**menu-button**
https://core.telegram.org/bots/features#commands

## Video penggunaan
![video_penggunaan_telebot](./github/src/video1.mp4)
[![Now in Android: 55](https://i.ytimg.com/vi/Hc79sDi3f0U/maxresdefault.jpg)](https://youtu.be/eLiNNm7Nco0)