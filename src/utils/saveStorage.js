const fs = require('fs');
const path = require('path');

class SaveStorage {
    static checkSessionExist(fileName) {
        const dirPath = path.resolve(__dirname, '../data');
        const filePath = `${dirPath}/${fileName}.json`
        if (!fs.existsSync(dirPath)) {
            console.log(`Create file in ${dirPath}`);
            fs.mkdirSync(dirPath)
        }
        
        if (!fs.existsSync(filePath)) {
            console.log(`File Doesn\'t exist in src/data/${fileName}.json`);
            fs.writeFileSync(`${filePath}`, "[]", 'utf-8')
            // jika belum buat fileBaru dengan filePath
        }

        return filePath
    }

    static loadSession(filePath) {
        const fileSession = fs.readFileSync(`${filePath}`, 'utf-8')
        const sessions = JSON.parse(fileSession)

        // console.log(sessions);
        return sessions
    }

    static set(userAttrib, fileName) {
        /**
         * TODO 
         * SET Session to session.json
         */
        if (Array.isArray(userAttrib)) {
            throw 'Not support for array, use object'
        }

        if (userAttrib instanceof Object) {
            const checkFileExist = this.checkSessionExist(fileName)
            const sessions = this.loadSession(checkFileExist)

            const isDuplicate = sessions.find((session) => session.id == userAttrib.id)
            if (isDuplicate) {
                throw 'ID is registerd'
            }
            
            sessions.push(userAttrib)
            fs.writeFileSync(checkFileExist, JSON.stringify(sessions))
            console.log('Sessions save !');

            return true
        }

        return false
    }
}

// function saveSession(stringSession, userAttrib) {
    
//     const dirPath = path.resolve(__dirname, '../data');

//     if (!fs.existsSync(dirPath)) {
//         console.log('File Doesn\'t exist in src/data/session.json');
//         console.log(`Create file in ${dirPath}`);
//         fs.mkdirSync(dirPath)
//         fs.writeFileSync(`${dirPath}/session.json`, "[]", 'utf-8')
//     }
// }

module.exports = { SaveStorage }