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
  
    return `
    🚫 Please wait a moment, this may take a few minutes. In the meantime, don't send too many similar requests. 🚫
    Channel Title —» ID 
    ${searchGroup.map(item => `${item.title} => ${item.id}\n`)}`
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
    const datas = searchGroup.map(item => ` [${item.title}](https://t.me/c/${item.folderId}) => ${item.id}\n`)
    return `
    🚫 Please wait a moment, this may take a few minutes. In the meantime, don't send too many similar requests. 🚫
    Group Title —» ID 
    ${datas.toString().replaceAll(",", "")}`
}

module.exports = { getchanelDB, getgroupDB }