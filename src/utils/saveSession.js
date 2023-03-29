const fs = require('fs');
const path = require('path');
const validator = require('validator')

class SaveSession {
    static checkSessionExist() {
        const dirPath = path.resolve(__dirname, '../data');
        const filePath = `${dirPath}/session.json`
        if (!fs.existsSync(dirPath)) {
            console.log('File Doesn\'t exist in src/data/session.json');
            console.log(`Create file in ${dirPath}`);
            fs.mkdirSync(dirPath)
            fs.writeFileSync(`${filePath}`, "[]", 'utf-8')
        }

        return filePath
    }

    static loadSession(filePath) {
        const fileSession = fs.readFileSync(`${filePath}`, 'utf-8')
        const sessions = JSON.parse(fileSession)

        // console.log(sessions);
        return sessions
    }

    static set(userAttrib) {
        /**
         * TODO 
         * SET Session to session.json
         */
        if (Array.isArray(userAttrib)) {
            return 'Not support for array, use object'
        }

        if (userAttrib instanceof Object) {
            const checkFileExist = this.checkSessionExist()
            const sessions = this.loadSession(checkFileExist)

            const isDuplicate = sessions.find((session) => session.id == userAttrib.id)
            if (isDuplicate) {
                throw 'ID / Phone Number is registerd'
            }

            if (!validator.isMobilePhone(userAttrib.phoneNumber, "id-ID")) {
                throw "Prefix / Phone Number is unvalid"
            }

            sessions.push(userAttrib)
            fs.writeFileSync(checkFileExist, JSON.stringify(sessions))
            console.log('Sessions save !');

            return 'Session Save !'
            /** userAttrib <======= dataExample
                {
                    "id": 123456,
                    "phoneNumber": "+6282191029737",
                    "session": "12adaweqwrad12131scxzc",
                    "dialogs": [
                        {
                            "id": "",
                            "name": "",
                            "isGroup": true,
                            "isBot": false    
                        }
                    ]
                }
            */
        }
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

module.exports = { SaveSession }