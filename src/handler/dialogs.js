const { SaveStorage } = require("../utils/saveStorage");

function getchanelDB(idFromUser) {
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
        return ""
    }
    
    return searchGroup.map(item => `\n[${item.title}](https://t.me/c/${item.folderId}/999999999) => ${item.id}`)
}

function getgroupDB(idFromUser) {
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
        return ""
    }
    
    return searchGroup.map(item => `\n[${item.title}](https://t.me/c/${item.folderId}/999999999) => ${item.id}`)
}

module.exports = { getchanelDB, getgroupDB }