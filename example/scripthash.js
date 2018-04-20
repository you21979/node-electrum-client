const electrumclient = require('..')
const Client = electrumclient.Client
const ElectrumProtocol = electrumclient.v4.ElectrumProtocol
const validate = electrumclient.v4.validate

const proc = async (ecl) => {
    const balance = await ecl.blockchain_scripthash_getBalance("676ca8550e249787290b987e12cebdb2e9b26d88c003d836ffb1cb03ffcbea7c")
    console.log("validate: " + validate.ICoinBalance(balance))
    console.log(balance)
    const unspent = await ecl.blockchain_scripthash_listunspent("676ca8550e249787290b987e12cebdb2e9b26d88c003d836ffb1cb03ffcbea7c")
    console.log(unspent)
    const history = await ecl.blockchain_scripthash_getHistory("676ca8550e249787290b987e12cebdb2e9b26d88c003d836ffb1cb03ffcbea7c")
    console.log(history)
    const mempool = await ecl.blockchain_scripthash_getMempool("676ca8550e249787290b987e12cebdb2e9b26d88c003d836ffb1cb03ffcbea7c")
    console.log(mempool)
}

const main = async () => {
    // autogenerate client name
    const myname = [ElectrumProtocol.libname, ElectrumProtocol.hash].join('-')
    console.log(myname)

    // initialize
    const ecl = new ElectrumProtocol(new Client(50002, 'bitcoins.sk', 'tls'))

    // wait a connection
    await ecl.client.connect()

    try{
        // negotiation protocol
        const res = await ecl.server_version(myname)
        console.log(res)
    }catch(e){
        // negotiation error
        await ecl.client.close()
        console.log(e)
        return;
    }

    try{
        await proc(ecl)
    }catch(e){
        console.log(e)
    }
    await ecl.client.close()
}
main().catch(console.log)
