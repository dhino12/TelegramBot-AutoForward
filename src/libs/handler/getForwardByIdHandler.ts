import { createRepository } from "../../db/repositories";
import createHasher from "../hasher/bcrypt";
import getForwardByIdUseCase from "../usecase/getForwardByIdUseCase";

async function getForwardByIdHandler(id: string): Promise<{
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
    const hasher = createHasher()
    const repository = createRepository()

    const session = await getForwardByIdUseCase(id, { repository, hasher })
    
    return session
}

