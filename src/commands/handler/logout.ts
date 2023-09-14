import { Context } from "grammy";
import { logout } from "../middleware";

const logoutUser = async (ctx: Context): Promise<void> => {
    await logout(ctx)
};

export default logoutUser;
