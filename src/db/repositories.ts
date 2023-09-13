import { DocumentData, QuerySnapshot, deleteDoc, getDoc, updateDoc } from "firebase/firestore";
import { db, collection, doc, getDocs, setDoc, query, where, auth, signInWithEmailAndPassword  } from "./fire";
import axios from 'axios';
import dotenv from 'dotenv'
dotenv.config()

function createRepository() {
    // Inisialisasi Firebase Auth        
    const email = `${process.env.YOUR_EMAIL_AUTH}`; // Ganti dengan email dan password yang sesuai
    const password = `${process.env.YOUR_PASSWORD_AUTH}`; // Ganti dengan kata sandi yang sesuai
    
    async function getUserById(id: string, collectionName: string): Promise<object>{
        // ========= get dataByFieldId
        await signInWithEmailAndPassword(auth, email, password);
        
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

    async function getAllUser() {
        const docSnap = await getDocs(collection(db, 'users'))
        const users: any[] = []
        docSnap.forEach((doc) => {
            users.push({
                idDocument: doc.id,
                ...doc.data()
            })
        })
        return users
    }
    
    async function getAllForwardById(id: string, collectionName: string): Promise<{
        from: [string], to: [string], id: string, name: string, worker: string, idDocument: string
    }[]>{
        // ========= get dataByFieldId
        await signInWithEmailAndPassword(auth, email, password);

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

    async function getAllForwards(from: string|undefined): Promise<{
        from: [string], to: [string], id: string, name: string, worker: string, idDocument: string
    }[]> {
        let docSnap: QuerySnapshot<DocumentData>
        if (from != undefined) {
            docSnap = await getDocs(query(collection(db, 'forwardWorker'), where("id", "array-contains", from)))
        } else {
            docSnap = await getDocs(collection(db, 'forwardWorker'))
        }
        const forwards: any[] = []
        docSnap.forEach((doc) => {
            forwards.push({
                idDocument: doc.id,
                ...doc.data()
            })
        })
        return forwards
    }

    async function createUser(body: object, idDocument: string, collectionName: string) {
        // =========== Add Data
        // Add a new document in collection "users"
        // await setDoc(doc(db, "users", idDocument), body);
        
        // Autentikasi pengguna
        await signInWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, collectionName, `${idDocument}`), body);
    }

    async function updateUserById(body: object, idDocument: string, collectionName: string) {
        await signInWithEmailAndPassword(auth, email, password);
        const userRef = doc(db, collectionName, idDocument);
        await updateDoc(userRef, body);
    }

    async function getDocumentIdById(id: string, collectionName: string) {
        await signInWithEmailAndPassword(auth, email, password);
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
        await signInWithEmailAndPassword(auth, email, password);
        await deleteDoc(doc(db, collectionName, idDocument))
    }

    async function deleteForwardByWorkerName(id, workerName) {
        await signInWithEmailAndPassword(auth, email, password);
        const q = query(collection(db, "forwardWorker"), where("worker", '==', workerName), where("id", "==", id));
        const querySnapshot = await getDocs(q);
    
        return Promise.all(querySnapshot.docs.map(async (doc) => {
            if (doc.data().id === id) {
                await deleteDoc(doc.ref);
                console.log(`Dokumen dengan field ${workerName} = worker telah dihapus dari koleksi forwardWorker.`);
                return true;
            }
            return false;
        }));
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