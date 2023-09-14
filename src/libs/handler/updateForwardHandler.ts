import { createRepository } from "../../db/repositories"
import createHasher from "../hasher/bcrypt"
import updateForwardByIdUseCase from "../usecase/updateForwardUseCase"

async function updateForwardByIdHandler(body: {
    from: [string],
    to: [string],
    id: string,
    name: string,
    worker: string,
}): Promise<{
    code: number,
    data: {
        from: [string],
        to: [string],
        id: string,
        name: string,
        worker: string,
        idDocument: string,
    },
    message: string
}> {
    const repository = createRepository()
    const hasher = createHasher()

    const result = await updateForwardByIdUseCase(body, { repository, hasher })
    return result
}

export default updateForwardByIdHandler