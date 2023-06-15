import { createRepository } from "../../db/repositories"
import createForwardUseCase from "../usecase/createForwardUseCase"
import createHasher from "../hasher/bcrypt"

async function insertForwardHandler(body: object): Promise<{
    code: number,
    data: {
        from: [],
        to: [],
        id: string,
        name: string,
        worker: string,
    },
    message: string
}> {
    const repository = createRepository()
    const hasher = createHasher()

    const user = await createForwardUseCase(body, {repository, hasher})
    return user
}

export default insertForwardHandler