/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from "fs";
import path from "path";

class SaveStorage {
    static checkSessionExist(fileName: string) {
        const dirPath = path.resolve(__dirname, "../data");
        const filePath = `${dirPath}/${fileName}.json`;

        if (!fs.existsSync(dirPath)) {
            console.log(`Create file in ${dirPath}`);
            fs.mkdirSync(dirPath);
        }

        if (!fs.existsSync(filePath)) {
            console.log(`File Doesn\'t exist in src/data/${fileName}.json`);
            fs.writeFileSync(`${filePath}`, "[]", "utf-8");
            // jika belum buat fileBaru dengan filePath
        }

        return filePath;
    }

    static loadSession(filePath: string) {
        const fileSession = fs.readFileSync(`${filePath}`, "utf-8");
        const sessions = JSON.parse(fileSession);

        // console.log(sessions);
        return sessions;
    }

    static set(userAttrib: any, fileName: string) {
        /**
         * TODO
         * SET Session to session.json
         */
        if (Array.isArray(userAttrib)) {
            throw "Not support for array, use object";
        }

        if (userAttrib instanceof Object) {
            const checkFileExist = this.checkSessionExist(fileName);
            const sessions = this.loadSession(checkFileExist);

            const isDuplicate = sessions.find((session) => session.id == userAttrib.id);
            if (isDuplicate && fileName != "forwardWorker") {
                throw "ID is registerd";
            }

            sessions.push(userAttrib);
            fs.writeFileSync(checkFileExist, JSON.stringify(sessions));
            console.log("Sessions save !");

            return true;
        }

        return false;
    }

    static updateDialogs(id: number, fileName: string, dialogs: any) {
        return new Promise((resolve, reject) => {
            const filePath = this.checkSessionExist(fileName);
            let sessionsData = this.loadSession(filePath);
            const sessionTmp = sessionsData.find((session) => session.id == id);
            sessionsData = sessionsData.filter((session) => session.id != id);

            if (sessionTmp == undefined)
                return reject({
                    code: 404,
                    message: `Session with id:${id} notfound`,
                });

            const dialogsDb = sessionTmp.dialogs.filter((dialog, index) => {
                if (dialogs.length - 1 >= index) {
                    return dialog.id != dialogs[index].id;
                }
            });
            // console.log(dialogsDb);
            dialogsDb.push(...dialogs);
            sessionTmp.dialogs = [];
            sessionTmp.dialogs.push(...dialogsDb);

            sessionsData.push(sessionTmp);

            fs.writeFileSync(filePath, JSON.stringify(sessionsData));
            console.log("Sessions Updated");
            resolve({ status: "200", message: "Sessions Updated" });
        });
    }

    static rm(id: number, fileName: string) {
        const checkFileExist = this.checkSessionExist(fileName);
        const sessions = this.loadSession(checkFileExist);

        const removeSession = sessions.filter((session) => session.id != id);
        console.log(removeSession);
        fs.writeFileSync(checkFileExist, JSON.stringify(removeSession));
        console.log("Sessions removed !");

        return true;
    }
}
export { SaveStorage };
