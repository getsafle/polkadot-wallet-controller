var assert = require('assert');
const Polkadot = require('../src/index')
const {
    HD_WALLET_12_MNEMONIC,
    TESTING_MESSAGE_1,
    TESTING_MESSAGE_2,
    TESTING_MESSAGE_3,
    POLKADOT_NETWORK: {
        TESTNET,
        MAINNET
    },
    POLKADOT_TRANSACTION_TYPE: {
        NATIVE_TRANSFER,
        STACKING
    },
    POLKADOT_DECIMAL: {
        TESTNET_DECIMAL, // Polkadot testnet is WESTEND 
        MAINNET_DECIMAL
    },

    TRANSFER_DOT: {
        DOT_RECEIVER,
        DOT_AMOUNT
    },
} = require('./constants')

const DOT_TXN_PARAM = {
    transaction: {
        data: {
            to: DOT_RECEIVER,
            amount: DOT_AMOUNT,
        }, txnType: NATIVE_TRANSFER
    },
    connectionUrl: TESTNET
}

describe('Initialize wallet ', () => {
    const dotWallet = new Polkadot(HD_WALLET_12_MNEMONIC)

    it("Should have correct mnemonic", () => {
        assert.equal(dotWallet.mnemonic, HD_WALLET_12_MNEMONIC, "Incorrect hd wallet")
    })

    it("Should generateWallet ", async () => {
        assert(dotWallet.address === null)
        const wallet = await dotWallet.generateWallet(TESTNET)
        console.log("wallet, ", wallet)
        assert(dotWallet.address !== null)
    })

    it("Should get privateKey ", async () => {
        const privateKey = await dotWallet.exportPrivateKey(TESTNET)
        console.log("privateKey, ", privateKey)
    })

    it("Sign message", async () => {
        const signedMessage1 = await dotWallet.signMessage(TESTING_MESSAGE_1, TESTNET)
        console.log("Signed message 1: ", signedMessage1)

        const signedMessage2 = await dotWallet.signMessage(TESTING_MESSAGE_2, TESTNET)
        console.log("Signed message 2: ", signedMessage2)

        const signedMessage3 = await dotWallet.signMessage(TESTING_MESSAGE_3, TESTNET)
        console.log("Signed message 3: ", signedMessage3)
    })

    it("Sign Transaction", async () => {
        const { signedTransaction, provider } = await dotWallet.signTransaction(DOT_TXN_PARAM.transaction, DOT_TXN_PARAM.connectionUrl);
        console.log("signedTransaction ", signedTransaction)

        const sendTransaction = await dotWallet.sendTransaction(signedTransaction, DOT_TXN_PARAM.connectionUrl)
        console.log("sendTransaction ", sendTransaction.transactionDetails)

        provider.disconnect()
    })

})