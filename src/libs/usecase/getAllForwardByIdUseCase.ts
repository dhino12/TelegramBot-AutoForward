async function getAllForwardByIdUseCase(id: string, { repository, hasher }): Promise<{
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
    const dataSession = await repository.getUserById(id, "forwardWorker")
    const toBash64 = await hasher.toBash64(id, dataSession.idDocument)
    
    const dataForwards = await repository.getAllForwardById(id, "forwardWorker")
    // console.log(dataForwards);
    
    return {
        code: 200,
        data: dataForwards,
        message: "Success"
    }
}

export default getAllForwardByIdUseCase