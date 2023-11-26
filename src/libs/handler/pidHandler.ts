import { createRepository } from "../../db/repositories";
import createHasher from "../hasher/bcrypt";
import {addPidUseCase, updatePidUseCase, getPidByIdUseCase, getAllPidUseCase} from "../usecase/pidUseCase";

async function getAllPidHandler(): Promise<{
    code: number,
    data: {
        pid: number,
        id: number
    }[],
    message: string
}> {
    const repository = createRepository()
    const hasher = createHasher()

    const user = await getAllPidUseCase({repository, hasher})
    return user
}

async function getPidByIdHandler(id: number): Promise<{
    code: number,
    data: {
        pid: number
    },
    message: string
}> {
    const repository = createRepository()
    const hasher = createHasher()

    const user = await getPidByIdUseCase(id, {repository, hasher})
    return user
}

async function addPidHandler(body: object): Promise<{
    code: number,
    data: {
        pid: number
    },
    message: string
}> {
    const repository = createRepository()
    const hasher = createHasher()

    const user = await addPidUseCase(body, {repository, hasher})
    return user
}

async function updatePidHandler(body: object): Promise<{
    code: number,
    data: {
        pid: number
    },
    message: string
}> {
    const repository = createRepository()
    const hasher = createHasher()

    const user = await updatePidUseCase(body, {repository, hasher})
    return user
}

export {addPidHandler, updatePidHandler, getPidByIdHandler, getAllPidHandler}