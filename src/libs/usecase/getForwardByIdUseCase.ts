async function getForwardByIdUseCase(id: string, { repository, hasher }): Promise<{
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
    const dataSession = await repository.getUserById(id, "forwardWorker")
    
    return {
        code: 200,
        data: dataSession,
        message: "Success"
    }
}

export default getForwardByIdUseCase