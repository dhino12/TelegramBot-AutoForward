/* eslint-disable prettier/prettier */
import insertForwardHandler from "../libs/handler/insertForwardHandler";
import { getAllForwardByIdHandler } from "../libs/handler/getAllForwardByIdHandler"

/**
 * Session Manajemen for forward ID and more
 */
const checkWorker = async (label: string, idFromUser: number) => {
    const resultAllWorker = await getAllForwardByIdHandler(idFromUser.toString())
    const findSameWorkers = resultAllWorker.data.filter(({ worker, id }) => { 
        return worker === label && id == idFromUser.toString()
    })[0];

    if (findSameWorkers) {
        return true;
    }
    return false;
}

const getAllForwardById = async(idFromUser: string) => {
    const resultAllWorkers = await getAllForwardByIdHandler(idFromUser)
    return resultAllWorkers.data
}

const resultSplitId = (from: string, to: string) => {
    /**
     * argCommand => /forward add worker1 <IdFrom> -> <IdTo>
     */
    const froms = from.split(',');
    const toMany = to.split(',');

    return { froms, toMany };
}

const loadWorkers = async (fromId: string) => {
    const resultWorker = await getAllForwardByIdHandler(fromId)
    return resultWorker
}

const saveToStorage = async (forwardInfo: any) => {
    const result = await insertForwardHandler(forwardInfo)
    if (result.code == 201) return true
    return false
}

export { resultSplitId, saveToStorage, loadWorkers, checkWorker, getAllForwardById }