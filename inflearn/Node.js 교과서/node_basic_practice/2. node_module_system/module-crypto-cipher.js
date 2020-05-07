const crypto = require('crypto');

const cipher = crypto.createCipher('aes-256-cbc', '열쇠');
let cipherText = cipher.update('비밀번호', 'utf8', 'base64');
cipherText += cipher.final('base64');

console.log('Cipher: ', cipherText);

const decipher = crypto.createDecipher('aes-256-cbc', '열쇠');
let plainText = decipher.update(cipherText, 'base64', 'utf8');
plainText += decipher.final('utf8');

console.log('Plain: ', plainText);
