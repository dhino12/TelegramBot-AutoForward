async function updateUserUseCase(body: {
    id: string, name: string, session: string, dialogs: {
        id: string, folderId: number, 
        title: string, isGroup: boolean, isChannel: boolean
    }[], isBot: boolean
}, { repository, hasher }): Promise<{
    code: number,
    data: {
        id: string, name: string, session: string, dialogs: {
            id: string, folderId: number, 
            title: string, isGroup: boolean, isChannel: boolean
        }[], isBot: boolean,
        idDocument: string
    },
    message: string
}> {
    const idDocument = await repository.getDocumentIdById(body.id, "users")
    await repository.updateUserById(body, idDocument, "users")
    
    return {
        code: 201,
        data: {...body, idDocument: idDocument},
        message: "Data has been success updated"
    }
}

export default updateUserUseCase;