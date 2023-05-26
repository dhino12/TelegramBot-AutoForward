import { MyContext } from "src/core/bot";

class ErrorBot {
    static phoneNotValid = 400
    static fromIdNotFound = 500
    static sessionNotFound = 401

    static messagePhoneNotValid = "Ooops PhoneNumber is notValid,\nplease follow /connect <phoneNumber>"
    static messageIdNotFound = "Error: Internal Server Error...."
    static messageSessionNotFound = "Unauthorized. Please connect with bot, /connect <Phone Number>"

    static errorHandler(ctx: MyContext, error: any) {
        switch (error.code) {
            case this.phoneNotValid:
                break;
            case this.fromIdNotFound:
                break
            case this.sessionNotFound:
                break
        }
    }
}

export default ErrorBot;
