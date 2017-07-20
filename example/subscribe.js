const ElectrumClient = require('..')
const sleep = (ms) => new Promise((resolve,_) => setTimeout(() => resolve(), ms))

const main = async () => {
    try{
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
            let version = await ecl.server_version("2.7.11", "1.0")
        }
        await ecl.close()
    }catch(e){
        console.log("error")
        console.log(e)
    }
}
main()
