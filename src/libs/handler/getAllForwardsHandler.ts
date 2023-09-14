import { createRepository } from "../../db/repositories";
import createHasher from "../hasher/bcrypt";
import getAllForwardUseCase from "../usecase/getAllForwardUseCase";

async function getAllForwardsHandler(from = ""): Promise<{
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

    const forwards = await getAllForwardUseCase(from, { repository, hasher })
    
    return forwards
}

export default getAllForwardsHandler