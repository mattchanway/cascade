const { CRYPTO_PASSWORD, CRYPTO_ALGORITHM, SALT } = require("./config");
const crypto = require('crypto');

const CRYPTO_KEY = crypto.scryptSync(CRYPTO_PASSWORD, SALT, 32);
 

 function encrypt(str){
   try{
   const iv = crypto.randomBytes(16);

    let cipher = crypto.createCipheriv('aes-256-cbc', CRYPTO_KEY, iv);
    let encrypted = cipher.update(str)
   encrypted = Buffer.concat([encrypted, cipher.final()]);

   // return {
   //    encryptedData: encrypted.toString('base64'),
   //    iv: iv.toString('base64')};
   return `${iv.toString('hex')}:.${encrypted.toString('hex')}`;
   }
   catch(e){
      return e;
   }

}


 function decrypt(text){

   try{

    let iv = Buffer.from(text.iv, 'hex')
   let encryptedText = Buffer.from(text.encryptedData, 'hex');
   console.log('INSIDE DECRYPTFN', encryptedText)
 let decipher = crypto.createDecipheriv(
        'aes-256-cbc', CRYPTO_KEY, iv);
 
 let decrypted = decipher.update(encryptedText);
 
 decrypted = Buffer.concat([decrypted, decipher.final()]);
 
 return decrypted.toString();
   }
   catch(e){
      return e;
   }

   
}


module.exports = {
    encrypt,
    decrypt
};