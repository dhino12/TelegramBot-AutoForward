async function getAllForwardUseCase(from:string|undefined, { repository, hasher }): Promise<{
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
    const dataForwards = await repository.getAllForwards(from)
    
    return {
        code: 200,
        data: dataForwards,
        message: "Success"
    }
}

export default getAllForwardUseCase