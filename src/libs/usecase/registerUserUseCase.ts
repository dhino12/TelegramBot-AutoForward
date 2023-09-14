async function registerUserUseCase(body, { repository, hasher }): Promise<{
    code: number,
    data: {
        id: number, name: string, session: string, dialogs: {
            id: string, folderId: number, 
            title: string, isGroup: boolean, isChannel: boolean
        }[], isBot: boolean,
        idDocument: string
    },
    message: string
}> {
    let hashedIdDocument = await hasher.hash(body.id)
    hashedIdDocument = await hasher.hash64(hashedIdDocument)
    await repository.createUser(body, hashedIdDocument, "users")

    return {
        code: 201,
        data: {
            id: body.id,
            name: body.name,
            session: body.session,
            dialogs: body.dialogs,
            isBot: body.isBot,
            idDocument: hashedIdDocument
        },
        message: `${body.name}, has been registerd`
    }
}

export default registerUserUseCase