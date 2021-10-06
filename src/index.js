const bip39 = require('bip39')
const axios = require("axios");

const helpers = require('./helper/index')
const { Keyring } = require('@polkadot/api');
const {
  mnemonicGenerate,
  mnemonicToMiniSecret,
  mnemonicValidate,
  naclKeypairFromSeed,
  cryptoWaitReady
} = require('@polkadot/util-crypto');

const { ApiPromise } = require("@polkadot/api");
const { WsProvider } = require("@polkadot/rpc-provider");

const { decodeAddress, encodeAddress } = require('@polkadot/keyring');
const { hexToU8a, isHex, stringToU8a, u8aToHex } = require('@polkadot/util');

const { construct, methods, getTxHash } = require("@substrate/txwrapper-polkadot");


const { polkadot: { HD_PATH }, polkadot_transaction: { NATIVE_TRANSFER }, polkadot_network: { MAINNET, TESTNET } } = require('./config/index')


class DOTHdKeyring {
  constructor(mnemonic) {
    this.mnemonic = mnemonic
    this.hdPath = HD_PATH
    this.wallet = null
    this.address = null
  }

  async generateWallet() {

    const keyring = new Keyring({ type: "sr25519" });
    const isCryptoReady = await cryptoWaitReady()
    if (isCryptoReady) {
      const account = keyring.addFromMnemonic(this.mnemonic);
      this.address = account.address
      return { wallet: this.wallet, address: this.address }
    } else {
      throw "Err"
    }
  }

  async exportPrivateKey() {
    // const keyring = new Keyring({ type: "sr25519" });
    // const account = keyring.addFromMnemonic(this.mnemonic);
    // const pkcs8 = account.encodePkcs8()
    // return { wallet: this.wallet, address: this.address }
    // console.log("pkcs8 ", pkcs8, u8aToHex(pkcs8), "\n", u8aToHex(keyPair.secretKey))

    const keyPair = helpers.utils.generateKeyPair(this.mnemonic)
    return { privateKey: u8aToHex(keyPair.secretKey) }
  }

  /**
 * NATIVE_TRANSFER : { data : {to, amount}, txnType: NATIVE_TRANSFER }
 *     
 */
  /**
   *  
   * @param {object: NATIVE_TRANSFER } transaction 
   * @param {string} connectionUrl | NETWORK = MAINNET 
   * @returns 
   */
  async signTransaction(transaction, connectionUrl) {
    const { data: { to, amount }, txnType } = transaction

    const keyring = new Keyring({ type: "sr25519" });
    const account = keyring.addFromMnemonic(this.mnemonic);
    // const network = helpers.utils.getNetwork()

    const provider = new WsProvider('wss://westend-rpc.polkadot.io');
    const api = await ApiPromise.create({ provider: provider });

    if (txnType === NATIVE_TRANSFER) {
      const txHash = await api.tx.balances
        .transfer(to, amount)
        .signAsync(account);

      console.log("txHash ", txHash)
      // --------------------------

      return { signedTransaction: txHash };
    }

  }

  async signMessage(message, connectionUrl) {
    const keyring = new Keyring({ type: "sr25519" });
    const isCryptoReady = await cryptoWaitReady()
    if (isCryptoReady) {
      const account = keyring.addFromMnemonic(this.mnemonic);
      const msg = account.sign(message)
      return { signedMessage: u8aToHex(msg) }
    } else {
      throw "Err"
    }


    // const isCryptoReady = await cryptoWaitReady()
    // if (isCryptoReady) {

    //   const keyPair = helpers.utils.generateKeyPair(this.mnemonic)
    //   const account = keyring.addFromPair(keyPair);
    //   console.log("account ", account)
    //   const msg = account.sign(stringToU8a(message))
    //   console.log("msg ", msg)
    //   // return {signedMessage: msg.toString()}
    // } else {
    //   throw "Error"
    // }
  }

  async getAccounts() {
    const keyring = new Keyring({ type: "sr25519" });
    const account = keyring.addFromMnemonic(this.mnemonic);
    return { address: account }
  }

  async sendTransaction(rawTransaction, connectionUrl) {
    const sentTxn = await rawTransaction.send()
    return { transactionDetails: u8aToHex(sentTxn) }
  }
}

module.exports = DOTHdKeyring
