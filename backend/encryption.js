const { CRYPTO_PASSWORD, CRYPTO_ALGORITHM } = require("./config");
const crypto = require('crypto');

const key = crypto.randomBytes(32);
 
const algorithm = 'aes-256-cbc';
const iv = crypto.randomBytes(16);


 function encrypt(str){
    let b = Buffer.from(key)
    console.log(key, iv, b)
    

    let cipher = crypto.createCipheriv('aes-256-cbc', b, iv);
    let encrypted = cipher.update(str)
   encrypted = Buffer.concat([encrypted, cipher.final()]);

   return encrypted.toString('hex');

}


 function decrypt(text){

    let iv = Buffer.from(text.iv, 'hex');

 let decipher = crypto.createDecipheriv(
        'aes-256-cbc', Buffer.from(key), iv);
 
 let decrypted = decipher.update(text);
 decrypted = Buffer.concat([decrypted, decipher.final()]);
 
 return decrypted.toString();

   
}


module.exports = {
    encrypt,
    decrypt
};