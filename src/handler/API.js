// const MTProto = require("@mtproto/core");
// const path = require('path')

// class API {
//     constructor() {
//         const server = { webogram: true };
//         this.mtproto = new MTProto({
//             api_id: 20450718,
//             api_hash: 'd7484191ce14a0ab151857143e11701f',
//             server,
//             storageOptions: {
//                 path: path.resolve(__dirname, './data/1.json'),
//             },
//         });
//     }

//     async call(method, params, options = {}) {
//         try {
//         const result = await this.mtproto.call(method, params, options);

//         return result;
//         } catch (error) {
//         console.log(`${method} error:`, error);

//         const { error_code, error_message } = error;

//         if (error_code === 420) {
//             const seconds = Number(error_message.split('FLOOD_WAIT_')[1]);
//             const ms = seconds * 1000;

//             await sleep(ms);

//             return this.call(method, params, options);
//         }

//         if (error_code === 303) {
//             const [type, dcIdAsString] = error_message.split('_MIGRATE_');

//             const dcId = Number(dcIdAsString);

//             // If auth.sendCode call on incorrect DC need change default DC, because
//             // call auth.signIn on incorrect DC return PHONE_CODE_EXPIRED error
//             if (type === 'PHONE') {
//             await this.mtproto.setDefaultDc(dcId);
//             } else {
//             Object.assign(options, { dcId });
//             }

//             return this.call(method, params, options);
//         }

//         return Promise.reject(error);
//         }
//     }

//     async getSession() {
//         const session = await this.mtproto.storage
//         console.log(session);
//         if (session) {
//           console.log('Sesi:', session);
//         } else {
//           console.log('Sesi belum tersimpan');
//         }
//     }
// }

// const api = new API();

// module.exports = api