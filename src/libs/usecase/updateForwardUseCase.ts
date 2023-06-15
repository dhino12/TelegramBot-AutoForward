async function updateForwardByIdUseCase(body: {
    from: [string], to: [string], id: string, name: string, worker: string
}, { repository, hasher }): Promise<{
    code: number,
    data: {
        from: [string], to: [string], id: string, name: string, worker: string,
        idDocument: string
    },
    message: string
}> {
    const idDocument = await repository.getDocumentIdById(body.id, "forwardWorker")
    const toBash64 = await hasher.toBash64(body.id, idDocument)
    await repository.updateUserById(body, idDocument, "forwardWorker")

    return {
        code: 201,
        data: {...body, idDocument: idDocument},
        message: "Data has been success updated"
    }
}

export default updateForwardByIdUseCase;