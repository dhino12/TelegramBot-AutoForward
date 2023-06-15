import bcrypt from "bcrypt"
import base64url from "base64url";

function createHasher() {
    return {
        hash: (id: string) => bcrypt.hash(id, 4),
        compare: (id: string, hash: string) => bcrypt.compare(id, hash, (err, hashing) => {
            if (hashing === true) {
                console.log('Nilai cocok dengan hash hasil base64 URL encoding!');
            } else {
                console.log('Nilai tidak cocok dengan hash hasil base64 URL encoding!');
            }
        }),
        hash64: (hash: string) => base64url.fromBase64(hash),
        toBash64: (hash: string) => base64url.toBase64(hash)
    }
}

export default createHasher