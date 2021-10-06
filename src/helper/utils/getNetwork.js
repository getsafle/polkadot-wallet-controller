const { ApiPromise } = require("@polkadot/api");
const { WsProvider } = require("@polkadot/rpc-provider");

const { polkadot_network: { MAINNET, TESTNET } } = require('../../config/index')

function getDataHubPolkadotNodeUrl(network, protocol) {
    if (network === POLKADOT_NETWORKS.WESTEND) {
        return (protocol === POLKADOT_PROTOCOLS.RPC)
            ? `https://${process.env.DATAHUB_POLKADOT_WESTEND_RPC_URL}/apikey/${process.env.DATAHUB_POLKADOT_API_KEY}`
            : `wss://${process.env.DATAHUB_POLKADOT_WESTEND_WS_URL}/apikey/${process.env.DATAHUB_POLKADOT_API_KEY}`
    } else {
        return (protocol === POLKADOT_PROTOCOLS.RPC)
            ? `https://${process.env.DATAHUB_POLKADOT_MAINNET_RPC_URL}/apikey/${process.env.DATAHUB_POLKADOT_API_KEY}`
            : `wss://${process.env.DATAHUB_POLKADOT_MAINNET_WS_URL}/apikey/${process.env.DATAHUB_POLKADOT_API_KEY}`
    }
}

function getSafeUrl(force = true) {
    return force ? 'wss://westend-rpc.polkadot.io' : getDataHubPolkadotNodeUrl(POLKADOT_NETWORKS.MAINNET, POLKADOT_PROTOCOLS.WS)
}

async function getActiveNetwork(_network) {
    const url = getSafeUrl()
    console.log("URL ", url)
    const provider = new WsProvider(url);
    const api = await ApiPromise.create({ provider: provider });
    const rawVersion = await api.rpc.system.version();
    const version = rawVersion.toHuman();
    // api.tx.balances.transfer().signAsync

    return {api, version}

}

module.exports = getActiveNetwork