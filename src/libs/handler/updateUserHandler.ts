import { createRepository } from "../../db/repositories";
import createHasher from "../hasher/bcrypt";
import updateUserUseCase from "../usecase/updateUserUseCase";

async function updateUserHandler(body: {
    id: string, name: string, session: string, dialogs: {
        id: string, folderId: number, 
        title: string, isGroup: boolean, isChannel: boolean
    }[], isBot: boolean, pid: number | undefined
}, dialogs: any[]): Promise<{
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
    const repository = createRepository()
    const hasher = createHasher()

    const dialogsDb = body.dialogs.filter((dialog, index) => {
        if (dialogs.length - 1 >= index) {
            return dialog.id != dialogs[index].id;
        }
    });
    dialogsDb.push(...dialogs)
    // console.log(dialogsDb);
    
    const result = await updateUserUseCase({...body, dialogs: dialogsDb}, { repository, hasher })
    // const result = {code: 1, data: {
    //     id: "", name: "", session: "", dialogs: [], isBot: false, idDocument: ""
    // }, message: ""}
    return result
}

export default updateUserHandler