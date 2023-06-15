import { deleteDoc, updateDoc } from "firebase/firestore";
import { db, collection, doc, getDocs, setDoc, query, where, getDoc } from "./fire";

function createRepository() {
    async function getUserById(id: string, collectionName: string): Promise<object>{
        // ========= get dataByFieldId
        const queryData = query(collection(db, collectionName), where("id", "==", id));
        const querySnapshot = await getDocs(queryData)
        let dataUser = {}
        querySnapshot.forEach((doc) => {
            dataUser = {
                ...doc.data(), idDocument: doc.id
            }
        })

        return dataUser
    }
    
    async function getAllForwardById(id: string, collectionName: string): Promise<{
        from: [string], to: [string], id: string, name: string, worker: string, idDocument: string
    }[]>{
        // ========= get dataByFieldId
        const queryData = query(collection(db, collectionName), where("id", "==", id));
        const querySnapshot = await getDocs(queryData)
        const dataForwards: any[] = []
        querySnapshot.forEach((doc) => {
            dataForwards.push({
                ...doc.data(), idDocument: doc.id
            })
        })

        return dataForwards
    }

    async function getAllFromIdForward(idFrom: string, collectionName: string): Promise<{
        from: [string], to: [string], id: string, name: string, worker: string, idDocument: string
    }[]> {
        // ========= get dataByFieldId
        const queryData = query(collection(db, collectionName), where("from", "array-contains", idFrom));
        const querySnapshot = await getDocs(queryData)
        const dataForwards: any[] = []
        querySnapshot.forEach((doc) => {
            dataForwards.push({
                ...doc.data(), idDocument: doc.id
            })
        })

        return dataForwards
    }

    async function createUser(body: object, idDocument: string, collectionName: string) {
        // =========== Add Data
        // Add a new document in collection "users"
        // await setDoc(doc(db, "users", idDocument), body);
        await setDoc(doc(db, collectionName, `${idDocument}`), body);
    }

    async function updateUserById(body: object, idDocument: string, collectionName: string) {
        const userRef = doc(db, collectionName, idDocument);
        await updateDoc(userRef, body);
    }

    async function getDocumentIdById(id: string, collectionName: string) {
        const queryData = query(collection(db, collectionName), where("id", "==", id))
        const querySnapshot = await getDocs(queryData)
        let idDocument = ""
        querySnapshot.forEach((doc) => {
            idDocument = doc.id
        })

        return idDocument
    }

    async function deleteUserById(idDocument: string, collectionName: string) {
        // Deleting documents in firestore"
        await deleteDoc(doc(db, collectionName, idDocument))
    }

    return {
        createUser, getUserById, updateUserById, getDocumentIdById, deleteUserById, getAllForwardById, getAllFromIdForward
    }
}

export { createRepository }