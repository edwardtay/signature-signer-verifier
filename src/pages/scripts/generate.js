

const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");

function generateKeys() {
  const privateKey = secp256k1.utils.randomPrivateKey();
  const publicKey = secp256k1.getPublicKey(privateKey);

  return {
    privateKey: toHex(privateKey),
    publicKey: toHex(publicKey),
  };
}

module.exports = { generateKeys };