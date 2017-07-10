const ElectrumClient = require('..')
const sleep = (ms) => new Promise((resolve,_) => setTimeout(() => resolve(ms), ms))

const main = async () => {
    const ecl = new ElectrumClient(995, 'btc.smsys.me', 'tls')
    ecl.subscribe.on('server.peers.subscribe', console.log)
    ecl.subscribe.on('blockchain.numblocks.subscribe', console.log)
    ecl.subscribe.on('blockchain.headers.subscribe', console.log)
    await ecl.connect()
    const p1 = await ecl.serverPeers_subscribe()
    const p2 = await ecl.blockchainHeaders_subscribe()
    const p3 = await ecl.blockchainNumblocks_subscribe()
    while(true){
        await sleep(1000)
    }
    await ecl.close()
}
main()
