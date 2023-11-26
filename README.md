# TelegramBot-AutoForward
AutoForward TelegramBot, Project ini menggunakan typescript sebagai recommended deployment dari grammyJS, tapi hal tersebut tidak beda jauh dari javascript.
**hello**

> Note: Bot ini berbeda dengan bot AutoForward yang sudah terkenal, ini adalah project untuk membuat seperti -nya

## Deploy
Saya sarankan menggunakan Cyclic untuk deploy telegram bot. **Free hosting. No credit card required.** \
[Tutorial Deploy telegram-bot ke Cyclic](https://www.cyclic.sh/posts/how-to-build-a-telegram-bot/) \
Jika ada yang baru bisa beritahu saya, caranya tuliskan issue baru di repo ini

[![Deploy to Cyclic](https://deploy.cyclic.sh/button.svg)](https://deploy.cyclic.sh/dhino12/TelegramBot-AutoForward)

> Note: Ketika menggunakan /connect, bot akan login sebagai anda, bot hanya akan mengambil data id dan nama group, channel, user, apabila anda mengirimkan perintah /getgroup, /getchanel, /getuser untuk keperluan forward, namun hal tersebut (/connect as user) membutuhkan resource lebih berat pada saat deploy (inilah yang masih menjadi PR untuk saya)

## Menjalankan di local
Clone Project ini dengan git, sebelumnya download git, dan nodejs, cari di google

> git clone https://github.com/dhino12/TelegramBot-AutoForward.git

### Install Semua Package
> npm i

### Cara menggunakan
Sebelum menggunakannya kamu bisa membuat bot terlebih dahulu dengan [botFather](https://t.me/botfather) baca cara pembuatannya dan dapatkan TOKEN Bot nya [Telegram Bot](https://core.telegram.org/bots#how-do-i-create-a-bot) <br>
Dikarenakan bot ini adalah auto forward maka daftarkan juga apps ini ke telegram ke sini [myTelegram](https://my.telegram.org/auth)
```
> Pastikan Kamu Sudah Mempunyai Atau Menaruh TOKEN Bot Dan API KEY Fitur Lainnya Di Environment (process.env.{nama_env})
    > buat file dengan .env
    > isikan didalamnya dengan
        BOT_TOKEN=<Token Bot>
        APPID=<APPID>
        APPHASH='<APPHASH>'
> Jika sudah, jalankan bot dengan npm run dev
> untuk mengubah semua code menjadi javascript dapat menggunakan `npm run build`
```

## Fitur

| Menu      | Fitur             | Deskripsi                   |
| --------- | ----------------- | --------------------------- |
| ✅        | getuser           | Mendapatkan ID - Nama User  |
| ✅        | getgroup          | Mendapatkan ID - Nama Group |
| ✅        | getchannel        | Mendapatkan ID - Nama Channel |
| ✅        | forward           | Setup auto forward          |
| ✅        | connect           | Setup akun                  |

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