async function getAllPidUseCase({ repository, hasher }): Promise<{
    code: number,
    data: {
        pid: number,
        id: number
    }[],
    message: string
}> {
    const dataForwards = await repository.getAllPid()
    
    return {
        code: dataForwards.status,
        data: dataForwards.data,
        message: "Success"
    }
}

async function getPidByIdUseCase(id, { repository, hasher }): Promise<{
    code: number,
    data: {
        pid: number,
        id: number
    },
    message: string
}> {
    const dataForwards = await repository.getPidById(id)
    
    return {
        code: dataForwards.status,
        data: dataForwards.data,
        message: "Success"
    }
}

async function addPidUseCase(body, { repository, hasher }): Promise<{
    code: number,
    data: {
        pid: number,
    },
    message: string
}> {
    const dataForwards = await repository.addPID(body)
    
    return {
        code: dataForwards.status,
        data: dataForwards.data,
        message: "Success"
    }
}

async function updatePidUseCase(body, { repository, hasher }): Promise<{
    code: number,
    data: {
        pid: number,
    },
    message: string
}> {
    const dataForwards = await repository.updatePID(body)
    
    return {
        code: dataForwards.status,
        data: dataForwards.data,
        message: "Success"
    }
}
export {addPidUseCase, getPidByIdUseCase, getAllPidUseCase, updatePidUseCase}