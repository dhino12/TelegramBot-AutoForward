import { createRepository } from "../../db/repositories";
import createHasher from "../hasher/bcrypt";
import getAllUserUseCase from "../usecase/getAllUserUseCase";

async function getAllUserHandler(): Promise<{
    code: number,
    data: {
        idDocument: string,
        id: string,
        isBot: boolean,
        name: string,
        session: '',
    }[],
    message: string
}> {
    const hasher = createHasher()
    const repository = createRepository()

    const forwards = await getAllUserUseCase({ repository, hasher })
    
    return forwards
}

export default getAllUserHandler