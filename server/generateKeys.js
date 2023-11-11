const { secp256k1 } = require('ethereum-cryptography/secp256k1');
const { toHex } = require('ethereum-cryptography/utils');

const firstPrivateKey = secp256k1.utils.randomPrivateKey();
const firstPublicKey = secp256k1.getPublicKey(firstPrivateKey);
console.log('First Private Key: ', toHex(firstPrivateKey));
console.log('First Public Key: ', toHex(firstPublicKey));

const secondPrivateKey = secp256k1.utils.randomPrivateKey();
const secondPublicKey = secp256k1.getPublicKey(secondPrivateKey);
console.log('Second Private Key: ', toHex(secondPrivateKey));
console.log('Second Public Key: ', toHex(secondPublicKey));

const thirdPrivateKey = secp256k1.utils.randomPrivateKey();
const thirdPublicKey = secp256k1.getPublicKey(thirdPrivateKey);
console.log('Third Private Key: ', toHex(thirdPrivateKey));
console.log('Third Public Key: ', toHex(thirdPublicKey));