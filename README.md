# TelegramBot-AutoForward
AutoForward TelegramBot, Project ini menggunakan typescript sebagai recommended deployment dari grammyJS, tapi hal tersebut tidak beda jauh dari javascript.

> Note: Bot ini berbeda dengan bot AutoForward yang sudah terkenal, ini adalah project untuk membuat seperti -nya

[![Deploy to Cyclic](https://deploy.cyclic.sh/button.svg)](https://deploy.cyclic.sh/dhino12/TelegramBot-AutoForward)

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
[![Tutorial](https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToBNJEdCfQpMOvxndPCyLZB1nmTjixJgh3BJVotm5SLu2SK4_6QmcUKoKZlB0ONWaE19Y&usqp=CAU)](https://youtu.be/eLiNNm7Nco0)