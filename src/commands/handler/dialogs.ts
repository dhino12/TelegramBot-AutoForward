import { SaveStorage } from "../../utils/saveStorage";

/**
 * 
 * @param idFromUser is a number ID from your telegram account
 * @returns list string of channel in your account (NOT BOT ACCOUNT)
 * @method This is useful for fetching a user from 
 * the database and displaying it to the user
 */
function getchanelDB(idFromUser: number): string[] {
    const filePath = SaveStorage.checkSessionExist('session');
    const sessionData = SaveStorage.loadSession(filePath)
    const searchSessionCurrent = sessionData.filter(
        ({id}) => id == idFromUser
      )[0]
    if (searchSessionCurrent == undefined)
        throw {
            code: 404,
            message: 'Sepertinya anda belum login, gunakan /connect untuk login'
        }
    const searchGroup = searchSessionCurrent.dialogs.filter(
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
function getgroupDB(idFromUser: number): string[] {
    const filePath = SaveStorage.checkSessionExist('session');
    const sessionData = SaveStorage.loadSession(filePath)
    const searchSessionCurrent = sessionData.filter(
        ({id}) => id == idFromUser
      )[0]
    
    if (searchSessionCurrent == undefined)
        throw {
            code: 404,
            message: 'Sepertinya anda belum login, gunakan /connect untuk login'
        }
    const searchGroup = searchSessionCurrent.dialogs.filter(
        ({isGroup}) => isGroup == true
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
function getUserDB(idFromUser: number): string[] {
    const filePath = SaveStorage.checkSessionExist('session');
    const sessionData = SaveStorage.loadSession(filePath)
    const searchSessionCurrent = sessionData.filter(
        ({id}) => id == idFromUser
      )[0]
    if (searchSessionCurrent == undefined)
        throw {
            code: 404,
            message: 'Sepertinya anda belum login, gunakan /connect untuk login'
        }
    const searchPrivateChat = searchSessionCurrent.dialogs.filter(
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