async function loginUserUseCase(id: string, { repository, hasher }): Promise<{
    code: number,
    data: {
        id: number, name: string, session: string, dialogs: {
            id: string, folderId: number, 
            title: string, isGroup: boolean, isChannel: boolean
        }[], isBot: boolean, pid: number | undefined
    } | undefined,
    message: string
}> {
    const dataSession = await repository.getUserById(id, "users")

    if (dataSession.id == undefined) {
        return {
            code: 404,
            data: undefined,
            message: "Session is empty, please register /connect <phone_number>"
        }
        
    }
    
    return {
        code: 200,
        data: dataSession,
        message: "Success login.."
    }
}

export default loginUserUseCase