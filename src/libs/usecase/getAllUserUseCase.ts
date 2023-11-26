async function getAllUserUseCase({ repository, hasher }): Promise<{
    code: number,
    data: {
        idDocument: string,
        id: string,
        isBot: boolean,
        name: string,
        session: '',
    }[],
    message: string
}> {
    const dataUsers = await repository.getAllUser()
    // console.log(dataForwards);
    
    return {
        code: 200,
        data: dataUsers,
        message: "Success"
    }
}

export default getAllUserUseCase