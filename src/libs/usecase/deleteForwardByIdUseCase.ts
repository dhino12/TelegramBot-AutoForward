async function deleteForwardByIdUseCase(id: string, workerName: string, { repository, hasher }): Promise<{
    code: number,
    data: string,
    message: string
}> {
    const result = await repository.deleteForwardByWorkerName(id, workerName)
    
    if (!result) {
        // throw {
        //     code: 400,
        //     message: "Gagal menghapus dokumen: " + id
        // }
    }

    return {
        code: 204,
        data: id,
        message: `Data with id: ${id}, has been removed`
    }
}

export default deleteForwardByIdUseCase