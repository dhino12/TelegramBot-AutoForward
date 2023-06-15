/* eslint-disable prettier/prettier */
import insertForwardHandler from "../libs/handler/insertForwardHandler";
import getAllForwardByIdHandler from "../libs/handler/getAllForwardByIdHandler"
import { SaveStorage } from "./saveStorage"
import getAllFromIdForwardHandler from "../libs/handler/getAllFromIdForwardHandler";

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

const resultSplitId = (argAction: string, argLabel: string, argCommand: string) => {
    /**
     * argCommand => /forward add worker1 <IdFrom> -> <IdTo>
     */
    const lenActionAndLabel = argAction.length + argLabel.length
    const forwardChatId = argCommand.slice(lenActionAndLabel + 1, argCommand.length)
    const from = forwardChatId.split("->")[0].trim();
    const to = forwardChatId.split("->")[1].trim();
    console.log(from, " <= from");
    console.log(to, " <= to");
    
    const froms = from.split(',');
    const toMany = to.split(',');

    return { froms, toMany };
}

const loadWorkers = async (fromId: string) => {
    const resultWorker = await getAllFromIdForwardHandler(fromId)
    return resultWorker
}

const saveToStorage = async (forwardInfo: any) => {
    const result = await insertForwardHandler(forwardInfo)
    if (result.code == 201) return true
    return false
}

export { resultSplitId, saveToStorage, loadWorkers, checkWorker, getAllForwardById }