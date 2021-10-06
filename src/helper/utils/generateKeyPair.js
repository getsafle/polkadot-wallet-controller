const {
    mnemonicGenerate,
    mnemonicToMiniSecret,
    mnemonicValidate,
    naclKeypairFromSeed
  } = require('@polkadot/util-crypto');

function generateKeyPair(mnemonic) {
    const isValidMnemonic = mnemonicValidate(mnemonic)
    console.log("isValidMnemonic ", isValidMnemonic)

    const userSeed = mnemonicToMiniSecret(mnemonic);

    // Generate new public/secret keypair for Alice from the supplied seed
    const keyPair = naclKeypairFromSeed(userSeed);

    return keyPair
}

module.exports = generateKeyPair