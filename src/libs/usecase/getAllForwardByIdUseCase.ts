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
    const dataForwards = await repository.getAllForwardById(id, "forwardWorker")

    return {
        code: 200,
        data: dataForwards,
        message: "Success"
    }
}

export default getAllForwardByIdUseCase