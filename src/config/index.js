module.exports = {
    polkadot: {
        HD_PATH: `m/44'/354'/0'/0'`,
    },
    polkadot_transaction: {
        NATIVE_TRANSFER: "NATIVE_TRANSFER"
    },
    polkadot_network: {
        MAINNET: {
            NETWORK: "MAINNET"
        },
        TESTNET: {
            NETWORK: "WESTEND" // Polkadot testnet is WESTEND 
        }
    },
    polkadot_decimal: {
        MAINNET: {
            DECIMAL: 10
        },
        TESTNET: {
            DECIMAL: 12
        }
    }
}