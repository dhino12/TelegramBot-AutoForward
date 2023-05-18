import { Composer } from "grammy";

require("./middleware");
import hello from "./handler/hello";
import start from "./handler/start";
import { MyContext } from "src/core/bot";
import callback_query from "./handler/callback_query";
import connect from "./handler/connect";
import getchanel from "./handler/getchanel";
import getuser from "./handler/getuser";
import forward from "./handler/forward";
import getgroup from "./handler/getgroup";
import { createConversation } from "@grammyjs/conversations";
import { login, logout, getGroup, getChannel, getUser } from "./middleware";
import msg from "./handler/msg";

const composer = new Composer<MyContext>();

composer.use(createConversation(login))
composer.use(createConversation(logout))
composer.use(createConversation(getGroup))
composer.use(createConversation(getChannel))
composer.use(createConversation(getUser))

composer.command("hello", hello);
composer.command("start", start);
composer.command("connect", connect);
composer.command("getchanel", getchanel);
composer.command("getuser", getuser);
composer.command("getgroup", getgroup);
composer.command("forward", forward);

composer.on("msg", msg)
composer.on("callback_query:data", callback_query);

export default composer;
