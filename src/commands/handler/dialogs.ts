import { SaveStorage } from "../../utils/saveStorage";

/**
 * 
 * @param idFromUser is a number ID from your telegram account
 * @returns list string of channel in your account (NOT BOT ACCOUNT)
 * @method This is useful for fetching a user from 
 * the database and displaying it to the user
 */
function getchanelDB(data: {
    id: number, name: string, session: string, dialogs: {
        id: string, folderId: number, 
        title: string, isGroup: boolean, isChannel: boolean
    }[], isBot: boolean
} | undefined): string[] {
    if (data == undefined)
        throw {
            code: 404,
            message: 'Sepertinya anda belum login, gunakan /connect untuk login'
        }
    const searchGroup = data.dialogs.filter(
        ({isChannel}) => isChannel  == true
    )
    console.log(searchGroup);
    if (searchGroup.length == 0) {
        return []
    }
    
    return searchGroup.map(item => `\n[${item.title}](https://t.me/c/${item.folderId}/999999999) => ${item.id}`)
}

/**
 * 
 * @param idFromUser is a number ID from your telegram account
 * @returns list string of group in your account (NOT BOT ACCOUNT)
 * @method This is useful for fetching a user from 
 * the database and displaying it to the user
 */
function getgroupDB(data: {
    id: number, name: string, session: string, dialogs: {
        id: string, folderId: number, 
        title: string, isGroup: boolean, isChannel: boolean
    }[], isBot: boolean
} | undefined): string[] {
    if (data == undefined)
        throw {
            code: 404,
            message: 'Sepertinya anda belum login, gunakan /connect untuk login'
        }
    
    const searchGroup = data.dialogs.filter(
        ({ isGroup, isChannel }) => isGroup == true && isChannel == false
    )
    if (searchGroup.length == 0) {
        return []
    }
    
    return searchGroup.map(item => `\n[${item.title}](https://t.me/c/${item.folderId}/999999999) => ${item.id}`)
}

/**
 * 
 * @param idFromUser is a number ID from your telegram account
 * @returns list string of user in your account (NOT BOT ACCOUNT)
 * @method This is useful for fetching a user from 
 * the database and displaying it to the user
 */
function getUserDB(data: {
    id: number, name: string, session: string, dialogs: {
        id: string, folderId: number, 
        title: string, isGroup: boolean, isChannel: boolean
    }[], isBot: boolean
} | undefined): string[] {
    if (data == undefined)
        throw {
            code: 404,
            message: 'Sepertinya anda belum login, gunakan /connect untuk login'
        }
    const searchPrivateChat = data.dialogs.filter(
        ({isGroup, isChannel}) => isGroup == false && isChannel == false
    )
    if (searchPrivateChat.length == 0) {
        return []
    }
    
    return searchPrivateChat.map(item => `\n[${item.title}](https://t.me/c/${item.folderId}/999999999) => ${item.id}`)
}

export {
    getUserDB, 
    getgroupDB,
    getchanelDB,
}