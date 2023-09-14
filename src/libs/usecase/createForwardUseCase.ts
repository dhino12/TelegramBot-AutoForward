async function createForwardUseCase(body, { repository, hasher }): Promise<{
    code: number,
    data: {
        from: [], to: [], id: string, name: string, worker: string
    },
    message: string
}> {
    let hashedIdDocument = await hasher.hash(body.id)
    hashedIdDocument = await hasher.hash64(hashedIdDocument)
    await repository.createUser(body, hashedIdDocument, "forwardWorker")

    return {
        code: 201,
        data: {
            id: body.id,
            name: body.name,
            from: body.from,
            to: body.to,
            worker: body.worker
        },
        message: `${body.name}, has been registerd`
    }
}

export default createForwardUseCase;