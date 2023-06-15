import { createRepository } from "../../db/repositories";
import createHasher from "../hasher/bcrypt";
import getAllFromIdForwardUseCase from "../usecase/getAllFromIdForwardUseCase";

async function getAllFromIdForwardHandler(id: string): Promise<{
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

    const forwards = await getAllFromIdForwardUseCase(id, { repository, hasher })
    
    return forwards
}

export default getAllFromIdForwardHandler