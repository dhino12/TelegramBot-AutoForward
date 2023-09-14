import { createRepository } from "../../db/repositories";
import createHasher from "../hasher/bcrypt";
import getAllForwardByIdUseCase from "../usecase/getAllForwardByIdUseCase";

async function getAllForwardByIdHandler(id: string): Promise<{
    code: number,
    data: {
        from: [],
        to: [],
        id: string,
        name: string,
        worker: string,
    }[],
    message: string
}> {
    const hasher = createHasher()
    const repository = createRepository()

    const forwards = await getAllForwardByIdUseCase(id, { repository, hasher })
    
    return forwards
}

export {getAllForwardByIdHandler}