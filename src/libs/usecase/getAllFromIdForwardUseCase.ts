async function getAllFromIdForwardUseCase(id: string, { repository, hasher }): Promise<{
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
    const dataForwards = await repository.getAllFromIdForward(id, "forwardWorker")
    
    return {
        code: 200,
        data: dataForwards,
        message: "Success"
    }
}

export default getAllFromIdForwardUseCase