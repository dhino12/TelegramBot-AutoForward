import { createRepository } from "../../db/repositories";
import createHasher from "../hasher/bcrypt";
import deleteUserUseCase from "../usecase/deleteUserUseCase";

async function deleteUserHandler(id: string): Promise<{
    code: number,
    data: string,
    message: string
}> {
    const repository = createRepository()
    const hasher = createHasher()

    const result = await deleteUserUseCase(id, { repository, hasher })
    return result;
}

export default deleteUserHandler