import { Composer } from "grammy";

// require("./middleware");
import hello from "./handler/hello";
import start from "./handler/start";
import callback_query from "./handler/callback_query";
import connect from "./handler/connect";
import getchanel from "./handler/getchanel";
import getuser from "./handler/getuser";
import { deleteForward, forward } from "./handler/forward";
import getgroup from "./handler/getgroup";
import msg from "./handler/msg"; 
import logoutUser from "./handler/logout";
import signInUser from "./handler/signIn";
import twoFactorAuth from "./handler/twoFactorAuth";

const composer = new Composer();

composer.command("hello", hello);
composer.command("start", start);
composer.command("connect", connect);
composer.command("logout", logoutUser);
composer.command("getchanel", getchanel);
composer.command("getuser", getuser);
composer.command("getgroup", getgroup);
composer.command("forward", forward);
composer.command("settings", forward);
composer.hears(/mycode\d+/, signInUser)
composer.hears(/^mypass:/i, twoFactorAuth)
composer.hears(/^worker=.*/, async (ctx) => await deleteForward(ctx, undefined));

composer.on("msg", msg);
composer.on("callback_query:data", callback_query);
composer.on("message:text", (ctx) => {
    console.log("message:text: " + ctx.msg.text); 
})
export default composer;