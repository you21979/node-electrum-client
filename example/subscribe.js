const electrumclient = require('..')
const Client = electrumclient.Client
const ElectrumProtocol = electrumclient.v4.ElectrumProtocol

const sleep = (ms) => new Promise((resolve,_) => setTimeout(() => resolve(), ms))
const proc = async (ecl) => {
    ecl.client.subscribe.on('blockchain.numblocks.subscribe', console.log)
    ecl.client.subscribe.on('blockchain.headers.subscribe', console.log)
    ecl.client.subscribe.on('blockchain.address.subscribe', console.log)
    ecl.client.subscribe.on('blockchain.scripthash.subscribe', console.log)

    const p1 = await ecl.server_peers_subscribe()
    console.log(p1)
    const p2 = await ecl.blockchain_headers_subscribe()
    console.log(p2)
    // Subscribe to corresponding scripthash for the above address
    const p4 = await ecl.blockchain_scripthash_subscribe('f3aa57a41424146327e5c88c25db8953dd16c6ab6273cdb74a4404ed4d0f5714')
    console.log(p4)
    while(true){
        await sleep(5000)
        console.time("ping")
        await ecl.server_ping()
        console.timeEnd("ping")
    }
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





