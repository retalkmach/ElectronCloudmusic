const crypto = require('crypto');
const iv = Buffer.from('0102030405060708');
const weapiKey = Buffer.from('0CoJUm6Qyw8W8jud');
const eapiKey = 'e82ckenh8dichen8';
const linuxapiKey = Buffer.from('rFgB&h#%2?^eDg:Q');
const base64 = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/';
const publicKey =
    '-----BEGIN PUBLIC KEY-----\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDgtQn2JZ34ZC28NWYpAUd98iZ37BUrX/aKzmFbt7clFSs6sXqHauqKWqdtLkF2KexO40H1YTX8z2lSgBBOAxLsvaklV8k4cBFK9snQXE9/DDaFt6Rr7iVZMldczhC0JNgTz+SHXT6CBHuX3e9SdB1Ua44oncaTWz7OBGLbCiK45wIDAQAB\n-----END PUBLIC KEY-----'

const aesEncrypt = (buffer, algorithm, key, iv) => {
    let cipher = crypto.createCipheriv(algorithm, key, iv);
    return Buffer.concat([cipher.update(buffer), cipher.final()])
}

const aesDecrypt = (buffer, algorithm, key, iv) => {
    let deCipher = crypto.createDecipheriv(algorithm, key, iv);
    return Buffer.concat([deCipher.update(buffer), deCipher.final()]);
}

const rsaEncrypt = (key, buffer) => {
    buffer = Buffer.concat([Buffer.alloc(128 - buffer.length), buffer]);
    return crypto.publicEncrypt({ 'key': key, padding: crypto.constants.RSA_NO_PADDING }, buffer);
}

const weapi = (data) => {
    let requestContent = JSON.stringify(data);
    let randomKey = ""
    for (let i = 0; i < 16; i++) {
        randomKey += base64.charAt(Math.floor(Math.random() * 64));
    }
    return {
        params: aesEncrypt(Buffer.from(aesEncrypt(Buffer.from(requestContent), 'aes-128-cbc', weapiKey, iv)).toString('base64'), 'aes-128-cbc', randomKey, iv).toString('base64'),
        encSecKey: rsaEncrypt(publicKey, Buffer.from(randomKey.split('').reverse().join(''))).toString('hex')
    }
}

const eapi = (data, url) => {
    let requestContent = typeof data === 'object' ? JSON.stringify(data) : data;
    let digest = crypto.createHash('md5').update(`nobody${url}use${requestContent}md5forencrypt`).digest('hex');
    requestContent = `${url}-36cd479b6b5-${requestContent}-36cd479b6b5-${digest}`;
    return {
        params: aesEncrypt(Buffer.from(requestContent), 'aes-128-ecb', eapiKey, '').toString('hex').toUpperCase()
    }
}
module.exports = { weapi, eapi, aesDecrypt }


//test demo
// let data = {
//     s: 'fade away',
//     type: 1,
//     limit: 30,
//     offset: 0
// }
// console.log(weapi(data))-9