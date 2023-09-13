# grammY Vercel boilerplate

https://api.telegram.org/bot6167635401:AAH0tZ7-qoKq8RMCoB-LcHOXEffkLrbVaXE/setWebhook?url=https://grammy-vercel-boilerplate-hfsqhjm8f-dhino12.vercel.app/api/index.ts

https://www.cyclic.sh/posts/how-to-build-a-telegram-bot/
https://medium.com/purwadhikaconnect/membangun-full-stack-application-dengan-firebase-cloud-firestore-1f9426ee8b9b
https://t.me/<YOUR USERNAME>
[grammY](https://grammy.dev/) boilerplate to develop and host telegram bots on [Vercel](https://vercel.com/).

## Features

-   Typescript support
-   Linting and formatting preconfigured
-   Development friendly environment with Nodemon

## Development

```bash
# Copy the .env example and change the BOT_TOKEN to match yours
$ cp .env.example .env
# Install the dependencies
$ npm install
# Run the development environment
$ npm run dev
```

## Deployment

## Error Session 
Error session ini terjadi pada saat deployment di cyclic sampai saat ini saya atau khususnya kami masih belum mengatahuinya, selengkapnya dapat dibaca dibawah
https://grammy.dev/plugins/session.html#session-keys

Pada saat deploy disarankan menggunakan Long pooling
https://grammy.dev/id/guide/deployment-types.html

https://api.telegram.org/bot6167635401:AAGKaDL5agG7OseIRi860a64D_KQvNrMfBI/setWebhook?url=https://fancy-hare-waistcoat.cyclic.app/
#### Terminal

```bash
# Install vercel cli if you don't have it yet
$ npm i -g vercel
# Deploy the project
$ vercel --prod
```
<div class="warning" style='background-color:#D9D8FD; color: #69337A; border-left: solid #805AD5 4px; border-radius: 4px; padding:0.7em;'>
<span>
<p style='margin-top:1em; text-align:center'>
<b>On the importance of sentence length</b></p>
<p style='margin-left:1em;'>
This sentence has five words. Here are five more words. Five-word sentences are fine. But several together bocome monotonous. Listen to what is happening. The writing is getting boring. The sound of it drones. It's like a stuck record. The ear demands some variety.<br><br>
    Now listen. I vary the sentence length, and I create music. Music. The writing sings. It has a pleasent rhythm, a lilt, a harmony. I use short sentences. And I use sentences of medium length. And sometimes when I am certain the reader is rested, I will engage him with a sentence of considerable length, a sentence that burns with energy and builds with all the impetus of a crescendo, the roll of the drums, the crash of the cymbals -- sounds that say listen to this, it is important.
</p>
<p style='margin-bottom:1em; margin-right:1em; text-align:right; font-family:Georgia'> <b>- Gary Provost</b> <i>(100 Ways to Improve Your Writing, 1985)</i>
</p></span>
</div>
#### Vercel

On your project's page, go to Settings > Environment Variables and add the following variables:

| Name        | Value            |
| ----------- | ---------------- |
| `BOT_TOKEN` | _your bot token_ |

> You can also set the webhook URL manually accessing `https://api.telegram.org/bot<bot_token>/setWebhook?url=<webhook_url>` on your browser

Finally, you should see a "Hello, world!" from the bot when typing `/hello` in chat.

## Using Express instead of Vercel's API

By default `grammy-vercel-boilerplate` does not use extra dependencies, but in case you want to use Express, first add it as a dependency

```sh
$ npm install express
```

And then edit the contents of `api/index.ts` to

```js
require("../src/index");

import express from "express";
import { webhookCallback } from "grammy";

import bot from "../src/core/bot";

const app = express();

app.use(express.json());
app.use(`/api/index`, webhookCallback(bot));

export default app;
```

## Contributing

Pull requests are welcome. If you have any suggestions, you can also create an [issue](https://github.com/neumanf/grammy-vercel-boilerplate/issues).

## License

[MIT](https://choosealicense.com/licenses/mit/)
