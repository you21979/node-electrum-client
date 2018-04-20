const electrumclient = require('..')
const Client = electrumclient.Client
const ElectrumProtocol = electrumclient.v2.ElectrumProtocol

const proc = async (ecl) => {
    const banner = await ecl.server_banner()
    console.log(banner)

    const donation = await ecl.server_donationAddress()
    console.log(donation)

    const features = await ecl.server_features()
    console.log(features)

    const peers = await ecl.server_peers_subscribe()
    console.log(peers)

    const txb_res = await ecl.blockchain_transaction_broadcast("xxxxxxxxxxx").catch(console.log)
    console.log(txb_res)

    const merkle = await ecl.blockchain_transaction_getMerkle("b4a083037802c8be269db4007c1264880cc78183f198a4d4286e84532f8c93e3", 1179428)
    console.log(merkle)

    const rawtx = await ecl.blockchain_transaction_get("b4a083037802c8be269db4007c1264880cc78183f198a4d4286e84532f8c93e3")
    console.log(rawtx)

    const estfee = await ecl.blockchain_estimatefee(2)
    console.log(estfee)

    const header = await ecl.blockchain_block_getHeader(1179428)
    console.log(header)

    const balance = await ecl.blockchain_address_getBalance("MMonapartyMMMMMMMMMMMMMMMMMMMUzGgh")
    console.log(balance)

    const unspent = await ecl.blockchain_address_listunspent("MMonapartyMMMMMMMMMMMMMMMMMMMUzGgh")
    console.log(unspent)

    const history = await ecl.blockchain_address_getHistory("MMonapartyMMMMMMMMMMMMMMMMMMMUzGgh")
    console.log(history)

    const chunk = await ecl.blockchain_block_getChunk(0)
    console.log(chunk)

    const mempool = await ecl.blockchain_address_getMempool("MMonapartyMMMMMMMMMMMMMMMMMMMUzGgh")
    console.log(mempool)

    const info = await ecl.blockchain_address_subscribe("MMonapartyMMMMMMMMMMMMMMMMMMMUzGgh")
    console.log(info)

    const bh = await ecl.blockchain_headers_subscribe()
    console.log(bh)

}

const main = async () => {
    // autogenerate client name
    const myname = [ElectrumProtocol.libname, ElectrumProtocol.hash].join('-')
    console.log(myname)

    // initialize
    const ecl = new ElectrumProtocol(new Client(50002, 'electrum-mona.bitbank.cc', 'tls'))

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

