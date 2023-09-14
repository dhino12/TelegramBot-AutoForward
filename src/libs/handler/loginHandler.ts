import { createRepository } from "../../db/repositories";
import createHasher from "../hasher/bcrypt";
import loginUserUseCase from "../usecase/loginUserUseCase";

async function loginHandler(id: string): Promise<{
    code: number,
    data: {
        id: number, name: string, session: string, dialogs: {
            id: string, folderId: number, 
            title: string, isGroup: boolean, isChannel: boolean
        }[], isBot: boolean, pid: number | undefined
    } | undefined,
    message: string
}> {
    const hasher = createHasher()
    const repository = createRepository()

    const session = await loginUserUseCase(id, { repository, hasher })
    
    return session
}

export default loginHandler