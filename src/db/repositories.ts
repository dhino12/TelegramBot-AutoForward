import { JSONbin  } from "./fire";
import axios from 'axios';
import dotenv from 'dotenv'
dotenv.config()

function createRepository() {
    // Inisialisasi Firebase Auth
    
    async function getUserById(id: string, collectionName: string): Promise<object>{
        // ========= get dataByFieldId
        if (id == undefined) { throw { code: 404, message: "ERROR ID undefined" } }
        const filePath = JSONbin.checkFileSessionExist(collectionName)
        const result = JSONbin.loadSession(filePath)
        const getUser = result.filter((item) => item.id == id)[0];
        if (getUser == undefined) return []

        return getUser
    }

    async function getAllUser() {
        const filePath = JSONbin.checkFileSessionExist("users")
        const result = JSONbin.loadSession(filePath)

        return result
    }
    
    async function getAllForwardById(id: string, collectionName: string): Promise<{
        from: [string], to: [string], id: string, name: string, worker: string, idDocument: string
    }[]>{
        const filePath = JSONbin.checkFileSessionExist(collectionName)
        const result = JSONbin.loadSession(filePath)
        const getUser = result.filter((item) => item.id == id);
        return getUser
    }

    async function getAllForwards(from: string|undefined): Promise<{
        from: [string], to: [string], id: string, name: string, worker: string, idDocument: string
    }[]> {
        const filePath = JSONbin.checkFileSessionExist('forwardWorker')
        const result = JSONbin.loadSession(filePath)
        if (from == "" || from == undefined) {
            return result
        } else {
            const getForwardsByFrom = result.filter((item) => item.from.includes(from));
            return getForwardsByFrom
        }
    }

    async function createUser(body: object, idDocument: string, collectionName: string) {
        // =========== Add Data
        // Add a new document in collection "users"

        JSONbin.set(body, collectionName)
    }

    async function updateUserById(body: object, idDocument: string, collectionName: string) {
        const filePath = JSONbin.checkFileSessionExist(collectionName)
        const sessions = JSONbin.loadSession(filePath)
        const removeSession = sessions.filter((session) => session.id != idDocument);
        removeSession.push(body)
        JSONbin.saveToJson(filePath, removeSession)
        return true
    }

    async function getDocumentIdById(id: string, collectionName: string) {
        const filePath = JSONbin.checkFileSessionExist(collectionName)
        const sessions = JSONbin.loadSession(filePath)
        const getId = sessions.filter((session) => session.id == id)[0];

        return getId
    }

    async function deleteUserById(idDocument: string, collectionName: string) {
        // Deleting documents in firestore"
        const result = JSONbin.rm(parseInt(idDocument), collectionName)
        if (result) return true
        else return false
    }

    async function deleteForwardByWorkerName(id, workerName) {
        const filePath = JSONbin.checkFileSessionExist("forwardWorker")
        const sessions = JSONbin.loadSession(filePath)
        const workerDeleted = sessions.filter((taskWorker) => taskWorker.id != id && taskWorker.worker != workerName);
        JSONbin.saveToJson(filePath, workerDeleted)
        return true
    } 

    async function getAllPid() {
        try {
            const result = await axios.get(`https://jsonbin.org/hafiskuhfi14/blog/`, {
                headers: {
                    Authorization: 'token 8b2b51a5-f8c8-47bd-a257-8f253ef488f6'
                }
            })
            return result
        } catch (error) {
            console.error(error);
            return [{status: 404, data: null}]            
        }
    }

    async function getPidById(id: number) {
        try {
            const result = await axios.get(`https://jsonbin.org/hafiskuhfi14/blog/${id}`, {
            headers: {
                Authorization: 'token 8b2b51a5-f8c8-47bd-a257-8f253ef488f6'
            }
            })
            console.log(result.status);
            return result
        } catch (error) {
            console.error(error);
            return {status: 404, data: null}   
        }
    }
    async function addPID(body: object) {
        console.log(Object.keys(body)[0]);
        
        const result = await axios.patch(`https://jsonbin.org/hafiskuhfi14/blog`, body, {
            headers: {
                Authorization: 'token 8b2b51a5-f8c8-47bd-a257-8f253ef488f6'
            }
        })
        console.log(result.status);
        
        return result
    }
    async function updatePID(body: object) {
        const key = Object.keys(body)[0]
        const result = await axios.post(`https://jsonbin.org/hafiskuhfi14/blog/${key}`, body[key], {
            headers: {
                Authorization: 'token 8b2b51a5-f8c8-47bd-a257-8f253ef488f6'
            }
        })
        
        return result
    }
    return {
        createUser, getUserById, updateUserById, getDocumentIdById, deleteUserById, getAllForwardById, getAllForwards, addPID, updatePID, getPidById, getAllPid, deleteForwardByWorkerName, getAllUser
    }
}

export { createRepository }