async function deleteUserUseCase(id: string, { repository, hasher }): Promise<{
    code: number,
    data: string,
    message: string
}> {
    const idDocument = await repository.getDocumentIdById(id, "users")
    const toBash64 = await hasher.toBash64(id, idDocument)
    await repository.deleteUserById(idDocument, "users")
    
    return {
        code: 204,
        data: idDocument,
        message: `Data with id: ${id}, has been removed`
    }
}

export default deleteUserUseCase