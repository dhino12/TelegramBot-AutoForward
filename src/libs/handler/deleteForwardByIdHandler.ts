import { createRepository } from "../../db/repositories";
import createHasher from "../hasher/bcrypt";
import deleteForwardByIdUseCase from "../usecase/deleteForwardByIdUseCase";

async function deleteForwardByIdHandler(id: string, workerName: string): Promise<{
    code: number,
    data: string,
    message: string
}> {
    const repository = createRepository()
    const hasher = createHasher()

    const result = await deleteForwardByIdUseCase(id, workerName, { repository, hasher })
    return result;
}

export default deleteForwardByIdHandler