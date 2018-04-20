'use strict';
const electrumclient = require('..')
const Client = electrumclient.Client
const ElectrumProtocol = electrumclient.v2.ElectrumProtocol

const createRaiiClient = (port, host, protocol, options) => {
    const myname = [ElectrumProtocol.libname, ElectrumProtocol.hash].join('-')
    return (params, promise) => {
        const name = params.join(':')
        const ecl = new ElectrumProtocol(new Client(port, host, protocol, options))
        console.time(name)
        return ecl.client.connect().then( () => ecl.server_version(myname) ).then( () => {
            return promise(ecl)
        }).catch( e => {
            ecl.client.close()
            console.timeEnd(name)
            throw e
        }).then( res => {
            ecl.client.close()
            console.timeEnd(name)
            return res
        })
    }

}

const main = async(hex) => {
    const hosts = ['electrum-mona.bitbank.cc', 'electrumx.tamami-foundation.org']
    const host = hosts[Math.floor(Math.random() * hosts.length)]
    const connect = createRaiiClient(50001, host, 'tcp')
    await connect(['blockchain_transaction_broadcast', hex], async(client) => {
        const result = await client.blockchain_transaction_broadcast(hex)
        console.log(result)
    })
}

const getopt = () => {
    return process.argv.slice(2)[0]
}

main(getopt()).catch(console.log)
