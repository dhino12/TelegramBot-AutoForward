import { createRepository } from "../../db/repositories";
import createHasher from "../hasher/bcrypt";
import registerUserUseCase from "../usecase/registerUserUseCase";

async function registerHandler(body: object): Promise<{
    code: number,
    data: {
        id: number, name: string, session: string, dialogs: {
            id: string, folderId: number, 
            title: string, isGroup: boolean, isChannel: boolean
        }[], isBot: boolean,
        idDocument: string
    },
    message: string
}> {
    const repository = createRepository()
    const hasher = createHasher()

    const user = await registerUserUseCase(body, {repository, hasher})
    return user
}

export default registerHandler